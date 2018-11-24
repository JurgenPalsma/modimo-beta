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
                    let date = new Date()
                    let ticket = new Ticket({
                    title: req.headers.title,
                    content: req.headers.content,
                    created_at: date,
                    updated_at: date,
                    votes: [],
                    status: ticketStatus.open,
                    author_id: user._id,
                    residence_id: user.residence,
                    });
                    ticket.save(function(err) {
                    Notif.createTicket(req.body.title, user._id, user.name, ticket.id, ticket.residence_id, io);
                    if (err) res.json({success: false, message: err.message});
                    else res.json({success: true, ticket: ticket});
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
                    else if ((user.roles.includes('CARETAKER') || user.roles.include('ROOT') || user.roles.includes('ADMIN'))) {
                        if (req.body.status == 'closed') {
                            Ticket.update({
                                _id: ticket.id}, {status:req.body.status, closed_by: user._id, resolution_time: Math.abs(new Date() - ticket.created_at)}, function(err) {
                                if (!err) {
                                    res.json({success: true, message: 'Ticket update success'})
                                }
                                else
                                    res.json({success: false, message: 'Ticket update Failed'})
                            });
                        } else {
                            Ticket.update({
                                _id: ticket.id}, {status:req.body.status}, function(err) {
                                if (!err) {
                                    res.json({success: true, message: 'Ticket update success'})
                                }
                                else
                                    res.json({success: false, message: 'Ticket update Failed'})
                            });
                        }
                    }
                    else return res.json({success: false, message: 'You must be CARETAKER or ADMIN to edit it'})
                });
            }
        });
    });

    // route to modify content of ticket by author
    apiRoutes.patch('/tickets/ticket', function(req, res) {
        if (!req.body.ticket_id || !req.body.content)
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
                    else if (user._id == ticket.author_id)
                        Ticket.update({
                            _id: ticket.id}, {content:req.body.content, updated_at:new Date()}, function(err) {
                            if (!err) {
                                return res.json({success: true, message: 'Ticket update success'})
                            }
                            else
                                return res.json({success: false, message: 'Ticket update Failed'})
                        });
                    else return res.json({success: false, message: 'You must be AUTHOR of the ticket to edit it'})
                });
            }
        });
    });


// Route to upvote or cancel upvote a ticket
    apiRoutes.patch('/tickets/ticket/vote', function(req, res) {
        if (!req.body.ticket_id)
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
                    else if (user._id != ticket.author_id && ticket.status == 'open')
                    {
                        nvotes = ticket.votes;
                        var found = nvotes.find(function(id) {
                            return id == user._id;
                        })
                        console.log(user._id);
                        if (nvotes.indexOf(user._id) == -1)
                        {
                            nvotes.push(user._id)
                        }
                        else
                        {
                            index = nvotes.indexOf(user._id)
                            nvotes.splice(index, 1)
                        }
                        Ticket.update({
                            _id: ticket.id}, {votes : nvotes}, function(err) {
                            if (!err) {
                                res.json({success: true, message: 'Ticket update success'})
                            }
                            else
                                res.json({success: false, message: 'Ticket update Failed'})
                        });
                    }
                    else return res.json({success: false, message: 'You must NOT be AUTHOR of the ticket to edit it, OR ticket must be OPEN'})
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
