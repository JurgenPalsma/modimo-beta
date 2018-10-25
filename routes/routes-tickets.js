const Ticket = require('../models/tickets/ticket');
const ticketStatus = require('../models/tickets/ticketStatus')
const ticketSorter = require('../functions/ticketSorter')
const Comment = require('../models/comment');
const User = require('../models/user');
const Notif = require('../functions/notifications');
const Notification = require('../models/notifications/notification');

module.exports = function(app, apiRoutes, io) {

// route to add a ticket
    apiRoutes.post('/tickets/ticket', function(req, res) {

        if (!req.headers.title || !req.headers.content)
            res.json({success: false, message: 'Error: request incomplete'});
        else
            User.findOne({token: req.headers['x-access-token']}, function (err, user) {
                if (err) throw err;
                else if (!user)
                    res.json({success: false, message: 'Bad auth token'});
                else {
                    let ticket = new Ticket({
                    title: req.headers.title,
                    content: req.headers.content,
                    created_at: new Date(),
                    updated_at: new Date(),
                    votes: [],
                    status: ticketStatus.open,
                    author_id: user._id,
                    residence_id: user.residence,
                    });
                    ticket.save(function(err) {
                    //Notif.createTicket(req.body.title, user._id, user.name, ticket.id, ticket.residence_id, io);
                    if (err) res.json({success: false, message: err.message});
                    else res.json({success: true, ticket: ticket});
                    });
                }
            });
    });

    // route to upvote/downvote
    apiRoutes.post('/tickets/vote', function(req, res) {

        if (!req.body.ticket_id)
            res.json({success: false, message: 'Error: request incomplete'});
        else
            User.findOne({token: req.headers['x-access-token']}, function (err, user) {
                if (err) throw err;
                else if (!user)
                    res.json({success: false, message: 'Bad auth token'});
                else {
                    Ticket.findOne({
                        _id: req.body.ticket_id
                    }, function (err, ticket) {
                        if (err) return res.json({success: false, message: 'Error from db'})
                        else if (!ticket) return res.json({success: false, message: 'Ticket not found'})
                        else {
                            let updated_votes = ticket.votes
                            if (updated_votes.indexOf(user._id) > -1) {
                                for (var i=updated_votes.length-1; i>=0; i--) {
                                    if (String(updated_votes[i]) === String(user._id)) {
                                        updated_votes.splice(i, 1);
                                    }
                                }
                            }
                            else {
                                updated_votes.push(user._id)
                            }
                            Ticket.update({ _id: ticket.id }, {
                                    votes: updated_votes
                                }, function(err) {
                                    if (err) res.json({success: false, message: 'Ticket update Failed'})
                                    else res.json({success: true, message: 'Ticket update success', ticket: ticket})
                            });
                        }
                            
                    });
                }
            });
    });




    // route to get ticket with specified id
    apiRoutes.get('/tickets/ticket', function(req, res) {
        if (!req.headers['ticket_id'])
             return res.json({success: false, message: 'Error: request incomplete'});
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found.'});
            else {
                Ticket.findOne({
                    _id: req.headers.ticket_id
                }, function (err, ticket) {
                    if (err) return res.json({success: false, message: 'Error from db'});
                    if (!ticket)
                        return res.json({success: false, message: 'Ticket not found'})
                    else
                        return res.json({success: true, ticket: ticket});
                });
            }
        });
    });

    // route to modify avancement ticket with id
    apiRoutes.patch('/tickets/ticket/avancement', function(req, res) {
        if (!req.body.ticket_id || !req.body.status)
            return res.json({success: false, message: 'Error: request incomplete'});
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found.'});
            else{
                Ticket.findOne({
                    _id: req.body.ticket_id
                }, function (err, ticket) {
                    if (err) return res.json({success: false, message: 'Error from db'})
                    if (!ticket)
                        return res.json({success: false, message: 'Ticket not found'})
                    else if ((user.roles == 'CARETAKER' || user.roles == 'ROOT' || user.roles == 'ADMIN'))
                        Ticket.update({
                            _id: ticket.id}, {status:req.body.status}, function(err) {
                            if (!err) {
                                res.json({success: true, message: 'Ticket update success'})
                            }
                            else
                                res.json({success: false, message: 'Ticket update Failed'})
                        });
                    else return res.json({success: false, message: 'You must be CARETAKER or ADMIN to edit it'})
                });
            }
        });
    });
    
    // Get les tickets d'une rési avec tri
    apiRoutes.get('/tickets', function(req, res) {
        if (!req.headers['residence_id'])
            return res.json({success: false, message: 'Error: request incomplete'});
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found.'});
            else {
                Ticket.find({
                    residence_id: req.headers.residence_id
                }, function (err, tickets) {
                    if (err) return res.json({success: false, message: 'Error from db'});
                    if (!tickets)
                        return res.json({success: false, message: 'info not found'})
                    else {
                        if (req.headers.ordered_by)
                            tickets = ticketSorter.sortTickets(req.headers.ordered_by, tickets)
                        return res.json({success: true, tickets: tickets});
                    }
                });
            }
        });
    });

    // route to modify ticket with id
    apiRoutes.patch('/tickets/ticket', function(req, res) {
        if (!req.body.ticket_id || !req.body.title || !req.body.status)
            return res.json({success: false, message: 'Error: request incomplete'});
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                return res.json({success: false, message: 'User not found.'});
            else{
                Ticket.findOne({
                    _id: req.body.ticket_id
                }, function (err, ticket) {
                    if (err) return res.json({success: false, message: 'Error from db'})
                    if (!ticket)
                        return res.json({success: false, message: 'Ticket not found'})
                    else if (ticket.author_id == user.id || user.roles.includes("ROOT") || user.roles.includes("ADMIN")
                    || user.roles.includes("CARETAKER"))
                        Ticket.update({
                            _id: ticket.id}, {title:req.body.title, updated_at:new Date(), status:req.body.status}, function(err) {
                            if (!err) {
                              if (req.body.status != ticket.status)
                                Notif.advancementTicket(req.body.title, user._id, user.name, ticket.id, req.body.status, ticket.residence_id, io);
                              else{
                                Notif.updateTicket(req.body.title, user._id, user.name, ticket.id, ticket.residence_id, io);
                                return res.json({success: true, message: 'Ticket update success'})
                              }
                                Ticket.findOne({
                                    _id: req.body.ticket_id
                                }, function (err, freshticket) {
                                    return res.json({success: true, ticket: freshticket, message: 'Ticket update success'})
                                });
                            }
                            else
                                return res.json({success: false, message: 'Ticket update Failed'})
                        });
                    else
                        return res.json({success: false, message: 'Permission denied'})
                });
            }
        });
    });

    // apiRoutes.patch('/tickets/ticket/comment', function(req, res) {
    //     if (!req.body.ticket_id || !req.body.content)
    //         return res.json({success: false, message: 'Error: request incomplete'});
    //     User.findOne({
    //         token: req.headers['x-access-token'],
    //     }, function (err, user) {
    //         if (err) return res.json({success: false, message: 'Error from db'});
    //         if (!user)
    //             return res.json({success: false, message: 'User not found.'});
    //         else{
    //             Ticket.findOne({
    //                 _id: req.body.ticket_id
    //             }, function (err, ticket) {
    //                 if (err) return res.json({success: false, message: 'Error from db'})
    //                 if (!ticket)
    //                     return res.json({success: false, message: 'Ticket not found'})
    //                 //
    //                 else
    //                     let now = new Date()

    //                     Ticket.update({
    //                         _id: ticket.id}, { $push: {content: req.body.content, }, title:req.body.title, updated_at:new Date(), status:req.body.status}, function(err) {
    //                         if (!err) {
    //                           if (req.body.status != ticket.status)
    //                             Notif.advancementTicket(req.body.title, user._id, user.name, ticket.id, req.body.status, ticket.residence_id, io);
    //                           else{
    //                             Notif.updateTicket(req.body.title, user._id, user.name, ticket.id, ticket.residence_id, io);
    //                             return res.json({success: true, message: 'Ticket update success'})
    //                           }
    //                             Ticket.findOne({
    //                                 _id: req.body.ticket_id
    //                             }, function (err, freshticket) {
    //                                 return res.json({success: true, ticket: freshticket, message: 'Ticket update success'})
    //                             });
    //                         }
    //                         else
    //                             return res.json({success: false, message: 'Ticket update Failed'})
    //                     });
    //             });
    //         }
    //     });
    // });

    // route to modify vote with id
    apiRoutes.patch('/tickets/ticket/vote', function(req, res) {
        if (!req.body.ticket_id)
            return res.json({success: false, message: 'Error: request incomplete'});
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                return res.json({success: false, message: 'User not found.'});
            else {
                Ticket.findOne({
                    _id: req.body.ticket_id
                }, function (err, ticket) {
                    if (err) return res.json({success: false, message: 'Error from db' + err.message})
                    if (!ticket)
                        return res.json({success: false, message: 'Ticket not found' + req.query.id})
                    else {
                        if (ticket.downvote.indexOf(user._id) != -1)
                        {
                            ticket.downvote.splice(ticket.downvote.indexOf(user._id), 1);
                            if (req.body.way == 'up')
                                ticket.upvote.push(user._id);
                        }
                        else if (ticket.upvote.indexOf(user._id) != -1)
                        {
                            ticket.upvote.splice(ticket.upvote.indexOf(user._id), 1);
                            if (req.body.way == 'down')
                                ticket.downvote.push(user._id );
                        }
                        else
                        {
                            if (req.body.way == 'down')
                                ticket.downvote.push(user._id );
                            if (req.body.way == 'up')
                                ticket.upvote.push(user._id)
                        }

                        Ticket.update({_id: ticket.id}, {upvote:ticket.upvote, downvote:ticket.downvote}, function (err) {
                            if (!err) {
                                return res.json({success: true, ticket: ticket})
                            }
                            else
                                return res.json({success: false, ticket: ticket})
                        });

                    }

                });
            }
        });
    });
    // route to delete ticket with id
    apiRoutes.delete('/tickets/ticket', function(req, res) {
        if (!req.body.ticket_id)
            return res.json({success: false, message: 'Error: request incomplete'});
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                return res.json({success: false, message: 'User not found.'});
            else {
                Ticket.findOne({
                    _id: req.body.ticket_id
                }, function (err, ticket) {
                    if (err) return res.json({success: false, message: 'Error from db'})
                    if (!ticket)
                        return res.json({success: false, message: 'Ticket not found'})
                    else if (ticket.author_id == user._id || (user.roles.includes('ADMIN') && user.residence == ticket.residence_id)) {
                        Comment.remove({$and:[{parent_id: ticket.id}, {parent_name:'ticket'}]}, function (err) {
                            if (!err)
                            {
                                Ticket.remove({
                                    _id: ticket.id
                                }, function (err) {
                                    if (!err){
                                      return res.json({success: true, message: 'Ticket removal success'})
                                    }
                                    else
                                        return res.json({success: false, message: 'Ticket removal Failed'})
                                });

                            }
                            else
                                return res.json({success: false, message: 'Ticket removal Failed'})
                        });
                    }
                    else
                       return res.json({success: false, message: 'You must be admin or author of the ticket to delete it'});
                });
            }
        });
    });
}
