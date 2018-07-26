const Ticket        = require('../models/tickets/ticket');
const Comment       = require('../models/comment');
const User          = require('../models/user');
const Notif         = require('../functions/notifications');
const Notification  = require('../models/notifications/notification');

module.exports = function(app, apiRoutes, io) {

  // route to add a ticket
  apiRoutes.post('/tickets/ticket', function(req, res) {

    if (!req.body.title || !req.body.description)
      res.json({success: false, message: 'Error: request incomplete'});
    else
      User.findOne({token: req.headers['x-access-token']}, function (err, user) {
        if (err) throw err;
        if (!user)
          res.json({success: false, message: 'Bad auth token'});
        else {
          let ticket = new Ticket({
            author_id: user._id,
            title: req.body.title,
            description: req.body.description,
            upvote: [],
            downvote:[],
            created_at: new Date(),
            updated_at: new Date(),
            residence_id: user.residence,
            advancement: '10',
          });

          ticket.save(function(err) {
            Notif.createTicket(req.body.title, user._id, user.name, ticket.id, ticket.residence_id, io);
            if (err) res.json({success: false, message: err.message});
            else res.json({success: true});
          });
        }
      });
  });

  // route to get list of tickets
  apiRoutes.get('/tickets/tickets', function(req, res) {
    User.findOne({
      token: req.headers['x-access-token'],
    }, function (err, user) {
      if (err) return res.json({success: false, message: 'Error from db'});
      if (!user)
        return res.json({success: false, message: 'User not found.'});
      else if (req.headers.author_id)
        Ticket.find({
          author_id: req.headers.author_id
        }, function(err, tickets) {
          if (err) return {success: false, message: 'Error from db'};
          else {

            // get all ids of authors
            var ids = [];
            for (t in tickets) {
                ids.push(tickets[t].author_id)
            }

            // find all authors and add them to tickets
            User.find({_id: {$in: ids}}, function(err, us) {
                if (err) return {success: false, message: 'Error from db'};
                if (!us) return {success: false, message: 'Not found'};
                else {
                    for (u in us) {
                        us[u].password = undefined;
                        us[u].token = undefined;
                        for (t in tickets) {
                            if (tickets[t].author_id == us[u]._id)
                                tickets[t].author = us[u];
                        }
                    }
                    return res.json({success: true, tickets: tickets});
                }
            });
          }
        })
      else {
        Ticket.find({residence_id: user.residence}).lean().exec(function(err, tickets) {
            if (err) return {success: false, message: 'Error from db'};
            else {

                // get all ids of authors
                var ids = [];
                for (t in tickets) {
                    ids.push(tickets[t].author_id)
                }

                // find all authors and add them to tickets
                User.find({_id: {$in: ids}}, function(err, us) {
                    if (err) return {success: false, message: 'Error from db'};
                    if (!us) return {success: false, message: 'Not found'};
                    else {
                        for (u in us) {
                            us[u].password = undefined;
                            us[u].token = undefined;
                            for (t in tickets) {
                                if (tickets[t].author_id == us[u]._id)
                                    tickets[t].author = us[u];
                            }                        
                        }
                        return res.json({success: true, tickets: tickets});
                    }
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
        if (!req.body.ticket_id || !req.body.advancement)
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
                            _id: ticket.id}, {advancement:req.body.advancement}, function(err) {
                            if (!err) {
                                res.json({success: true, message: 'Ticket update success'})
                            }
                            else
                                res.json({success: false, message: 'Ticket update Failed'})
                        });
                    else
                        return res.json({success: false, message: 'You must be CARETAKER or ADMIN to edit it'})
                });
            }
        });
    });

    // route to modify ticket with id
    apiRoutes.patch('/tickets/ticket', function(req, res) {
        if (!req.body.ticket_id || !req.body.title || !req.body.description || !req.body.advancement)
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
                            _id: ticket.id}, {description:req.body.description, title:req.body.title, updated_at:new Date(), advancement:req.body.advancement}, function(err) {
                            if (!err) {
                              if (req.body.advancement != ticket.advancement)
                                Notif.advancementTicket(req.body.title, user._id, user.name, ticket.id, req.body.advancement, ticket.residence_id, io);
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
