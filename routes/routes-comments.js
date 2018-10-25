const Ticket    = require('../models/tickets/ticket');
const User      = require('../models/user');
const Comment   = require('../models/comment');

var map = {}
map['ticket'] = Ticket;

function getParent(name) {
    return map[name];
}

module.exports = function(app, apiRoutes) {

    apiRoutes.post('/comments/comment', function(req, res) {
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found.'});
            else if (!req.body.parent_id || !req.body.parent_name || !req.body.content) {
                return res.json({success: false, message: 'Informations missing motha faka' + ' ' + req.body.parent_name + ' ' + req.body.parent_id + ' ' + req.body.content});
            }
            else {
                if (!getParent(req.body.parent_name))
                    return res.json({success: false, message: 'Parent not found'});
                getParent(req.body.parent_name).findOne({
                    _id: req.body.parent_id
                }, function (err, parent) {
                    if (err) return res.json({success: false, message: 'Error from db'});
                    if (!parent)
                        return res.json({success: false, message: 'Parent not found'});
                    else if (req.body.content.length)
                    {
                        const date = new Date();
                        let comment = new Comment({
                            content: req.body.content,
                            author_id: user._id,
                            parent_id: parent._id,
                            created_at: date,
                            updated_at: date
                        });
                        comment.save(function(err, room) {
                            if (err) res.json({success: false, message: err.message});
                            else {
                                Ticket.update({
                                    _id : room.parent_id
                                },
                                {$push: {comments: {_id : room._id}}}, function (err) {
                                    if (err) {
                                        res.json({success: false, message: 'Ticket update Failed'})
                                    }
                                    else
                                        res.json({success: true, message: 'Ticket update success'})
                                })
                            }
                        });
                    }
                });
            }
        });
    });

// route to get comments with parent id
    apiRoutes.get('/comments/comments', function(req, res) {
        if (!req.headers.parent_id)
            return res.json({success: false, message: 'Error: request incomplete'});
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found.'});
            else {
                Comment.find({
                    parent_id: req.headers.parent_id,
                }, function (err, comments) {
                    if (err) return res.json({success: false, message: 'Error from db'});
                    if (!comments)
                        return res.json({success: false, message: 'Parent not found'});
                    else {
                        return res.json({success: true, comments: comments});
                    }
                });
            }
        });
    });


// route to delete comment in parent with commentId
    apiRoutes.delete('/comments/comment', function(req, res) {
        if (!req.body.comment_id)
            return res.json({success: false, message: 'Error: request incomplete'});
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found.'});
            else {
                Comment.findOne({
                    _id: req.body.comment_id
                }, function (err, comment) {
                    if (err) return res.json({success: false, message: 'Error from dbo'})
                    if (!comment)
                        return res.json({success: false, message: 'Comment not found'})
                    else if (comment.author_id == user._id || user.roles.includes('ADMIN'))
                    {
                            Comment.remove({
                            _id: comment._id}, function(err) {
                            if (!err)
                                res.json({success: true, message: 'Comment removal success'})
                            else
                                res.json({success: false, message: 'Comment removal Failed'})
                        });
                    }
                    else 
                        return res.json({success: false, message: 'You must author of the comment to delete it'});
                });
            }
        });
    });

// route to update a comment in a parent
    apiRoutes.patch('/comments/comment', function(req, res) {
        if (!req.body.comment_id || !req.body.content)
            return res.json({success: false, message: 'Error: request incomplete'});
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found.'});
            else{
                Comment.findOne({
                    _id: req.body.comment_id
                }, function (err, comment) {
                    if (err) return res.json({success: false, message: 'Error from db'})
                    if (!comment)
                        return res.json({success: false, message: 'Comment not found'})
                    else if (comment.author_id == user.id)
                        Comment.update({
                            _id:comment._id},{content:req.body.content, updated_at:new Date()}, function(err) {
                            if (!err) {
                                res.json({success: true, message: 'Comment update success'})
                            }
                            else
                                res.json({success: false, message: 'Comment update Failed'})
                        });
                    else
                        return res.json({success: false, message: 'You must be the author of the ticket to edit it'})
                });
            }
        });
    });
}