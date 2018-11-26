const Message           = require('../models/messagerie/message');
const Contact           = require('../models/messagerie/contact');
const User              = require('../models/user');
const Conversation      = require('../models/messagerie/conversation');

/*          Modimo API - Messagerie              */

module.exports = function(app, apiRoutes, io) {

    /*---- Contact management ----*/

    // route to a contact
    apiRoutes.post('/messagerie/contact', function (req, res) {

        // check if request is valid
        // params:
        //          body.email: email of contact
        if (!req.body.email) {
            res.json({success: false, message: "Error: request incomplete"});
        } else {

            // check if user is auth
            User.findOne({token: req.headers['x-access-token']}, function (err, auth_user) {
                if (err) throw err;
                if (!auth_user) {
                    res.json({success: false, message: 'Bad auth token'});
                } else if (auth_user) {

                    // Check if user exists
                    User.findOne({email: req.body.email, residence: auth_user.residence}, function (err, user) {

                        if (err) throw err;
                        if (!user) {
                            return res.json({success: false, message: 'Add failed. User does not exist'});
                        } else if (user) {
                            // Check if contact exists
                            Contact.findOne({
                                name: user.name,
                                of: auth_user._id,
                            }, function (err, contact) {
                                if (err) throw err;
                                if (contact) {
                                    res.json({success: false, message: 'Add failed. Contact already exists'});
                                } else if (!contact) {
                                    // Create contact
                                    let contact = new Contact({
                                        name: user.name,
                                        uid: user._id,
                                        of: auth_user._id,
                                    });
                                    // Save contact to db
                                    contact.save(function (err) {
                                        if (err) throw err;
                                        res.json({success: true, contact: contact});
                                    });
                                }
                            });
                        }
                    })
                }
            });
        }
    });

    apiRoutes.delete('/messagerie/contact', function (req, res) {

        if (!req.body.uid || !req.headers['x-access-token']) {
            return res.json({success: false, message: "Error: request incomplete"});
        } else {
            User.findOne({
                token: req.headers['x-access-token'],
            }, function (err, user) {
                if (err) return res.json({success: false, message: 'Error from db'});
                if (!user) {
                    res.json({success: false, message: 'User not found.'});
                } else if (user) {
                    Contact.remove({
                        of: user.id,
                        uid: req.body.uid }, function(err) {
                        if (!err) {
                            res.json({success: true})}
                        else {
                            res.json({success: false, message: "Error from db"})
                        }
                    });

                }
            })
        }
    });

    // route to get list of contacts
    // apiRoutes.get('/messagerie/contacts', function (req, res) {

    //     User.findOne({
    //         token: req.headers['x-access-token'],
    //     }, function (err, user) {
    //         if (err) return res.json({success: false, message: 'Error from DB'});
    //         if (!user) {
    //             res.json({success: false, message: 'User not found.'});
    //         } else if (user) {
    //             Contact.find({
    //                 of: user.id,
    //             }, function (err, contacts) {
    //                 if (err) throw err;
    //                 if (contacts.length == 0) {
    //                     res.json({success: false, message: 'Error: user has no contact'});
    //                 } else if (contacts) {
    //                     res.json({
    //                         success: true,
    //                         contacts: contacts,
    //                     });
    //                 }
    //             })
    //         }
    //     });
    // });

    // route to get all available contacts
    apiRoutes.get('/messagerie/contacts', function (req, res) {
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from DB'});
            if (!user) return res.json({success: false, message: 'User not found'});
            else if (user) {
                User.find({
                    residence: user.residence
                }, function(err, contacts) {
                    if (err) return res.json({success: false, message: 'Error from DB'});
                    res.json({success: true, contacts: contacts});
                })
            }
        })
    })

    /*---- Conv management ----*/

    function addUserToConversation(user_id, conversation_id) {

    }

    apiRoutes.post('/messagerie/conversation', function (req, res) { // TODO make sure that there are no duplicates

        // check if request is valid
        // params:
        //          body.users: list of user ids
        if ((!req.body.users) || !req.headers['x-access-token']) {
            return res.json({success: false, message: "Error: request incomplete. Need: body.users ; header.x-access-token"});
        } else {
            let users = JSON.parse(req.body.users)
            // check user access token
            User.findOne({
                token: req.headers['x-access-token'],
            }, function (err, auth_user) {
                if (err) return res.json({success: false, message: 'Error from db'});
                if (!auth_user) {
                    return res.json({success: false, message: 'User not found.'})
                } else if (auth_user) {
                    User.find(
                    {_id: { $in: users }}, function (err, checked_users) {
                        if (err) return res.json({success: false, message: 'Error from db', err: err});
                        if (!checked_users || checked_users.length == 0) {
                            return res.json({success: false, message: 'User not found.'})
                        } else if (checked_users) {
                            for (let i = 0; i < users.length; i++ ){
                                if (checked_users[i].residence != auth_user.residence) {
                                    return res.json({success: false, message: 'User not in residence'});
                                }
                            }

                            // add yourself to the conversation
                            users.push(auth_user.id);
                            // Create conversation
                            let conversation = new Conversation({
                                with: users,
                                messages: [],
                                author: auth_user.id
                            });

                            // Save conv to db
                            conversation.save(function (err) {
                                if (err) return res.json({success: false});
                                // return conversation
                                io.emit('conversationListUpdateChannel')
                                res.json({success: true, conversation: conversation});
                            });
                        }
                    });
                }
            });
        }
    });

    apiRoutes.get('/messagerie/conversations', function (req, res) {

        // check if request is valid
        if (!req.headers['x-access-token']) {
            res.json({success: false, message: "Error: request incomplete. Need: header.x-access-token"});
        } else {
            // check user access token
            User.findOne({
                token: req.headers['x-access-token'],
            }, function (err, auth_user) {
                if (err) return res.json({success: false, message: 'Error from db'});
                if (!auth_user) {
                    res.json({success: false, message: 'User not found.'});
                } else if (auth_user) {


                    Conversation.find({
                        with: { $all : [auth_user.id] },
                    }, function (err, conversations) {
                        if (err) throw err;
                        if (!conversations) {
                            return res.json({success: false, message: 'Error: user has no conversations', conversation:[]});
                        } else if (conversations) {
                            return res.json({success: true, conversations: conversations})

                        }
                    });


                    //  return list of conversations ids
                }
            });
        }
    });

    apiRoutes.get('/messagerie/conversation', function (req, res) {

        // check if request is valid
        if (!req.headers.id || !req.headers['x-access-token']) {
            res.json({success: false, message: "Error: request incomplete. Need: headers.id, headers.x-access-token"});
        } else {
            // check user access token
            User.findOne({
                token: req.headers['x-access-token'],
            }, function (err, auth_user) {
                if (err) return res.json({success: false, message: 'Error from db'});
                if (!auth_user) {
                    res.json({success: false, message: 'User not found.'});
                } else if (auth_user) {

                    Conversation.findOne({
                        _id: req.headers.id,
                    }, function (err, conversations) {
                        if (err) throw err;
                        if (!conversations) {
                            return res.json({success: false, message: 'Error: user has no conversations', conversation:[]});
                        } else if (conversations) {
                            return res.json({success: true, conversation: conversations})

                        }
                    });
                }
            });
        }
    });

    apiRoutes.patch('/messagerie/conversation', function (req, res) {

        // check if request is valid
        if (!req.body.conversation_id || !req.body.remove || !req.body.user_id || !req.headers['x-access-token']) {
            res.json({success: false, message: "Error: request incomplete. Need: header.x-access-token"});
        } else {
            // check user access token
            User.findOne({
                token: req.headers['x-access-token'],
            }, function (err, auth_user) {
                if (err) return res.json({success: false, message: 'Error from db'});
                if (!auth_user) {
                    res.json({success: false, message: 'User not found.'});
                } else if (auth_user) {
                    return res.json({success: false, message: 'Not implem'})

                    //  check if conv exists

                    // if remove is true and user is author or user is self  -> remove from conv

                    // if remove is false and user is in contact of author -> add to conv

                    // return updated conv
                }
            });
        }
    });

    apiRoutes.delete('/messagerie/conversation', function (req, res) {

        if (!req.body.id || !req.headers['x-access-token']) {
            return res.json({success: false, message: "Error: request incomplete"});
        } else {
            User.findOne({
                token: req.headers['x-access-token'],
            }, function (err, user) {
                if (err) return res.json({success: false, message: 'Error from db'});
                if (!user) {
                    return res.json({success: false, message: 'Bad token'});
                } else if (user) {
                    Conversation.remove({
                        _id: req.body.id }, function(err) {
                        if (!err) {
                            return res.json({success: true})}
                        else {
                            return res.json({success: false, message: "Error from db"})
                        }
                    });

                }
            })
        }
    });

    /*---- Message management ----*/

    apiRoutes.post('/messagerie/:conversation_id/message', function (req, res) {

        if (!req.headers['content']) {
            res.json({success: false, message: "Error: request incomplete."});
        } else {
            // check user access token
            User.findOne({
                token: req.headers['x-access-token'],
            }, function (err, auth_user) {
                if (err) return res.json({success: false, message: 'Error from db'});
                if (!auth_user) {
                    res.json({success: false, message: 'User not found.'});
                } else if (auth_user) {

                    Conversation.findById(req.param("conversation_id") , function (err, conversations) {
                        if (err) throw err;
                        if (!conversations) {
                            return res.json({success: false, message: 'Error: user is not in conv'});
                        } else if (conversations) {

                            for (let i = 0; i != conversations["with"].length; i++) {
                                if (conversations["with"][i] == auth_user.id ||
                                conversations.author == auth_user.id) {
                                    Conversation.findByIdAndUpdate(
                                        req.param("conversation_id"),
                                        {$push: {"messages": {content: req.headers['content'], timestamp: Date.now(),  author: auth_user.id}}},
                                        {safe: true, upsert: true, new : true},
                                        function(err, model) {
                                            console.log(err);
                                        }
                                    );
                                    io.emit('messageChannel')
                                    return res.json({success: true})
                                }
                            }
                        }
                    });
                }
            });
        }
    });

    //  route to add a message
    apiRoutes.post('/messagerie/message', function (req, res) {

        // check if request is valid
        // params:
        //          body.to: userID to send the message to
        //          body.content: text message
        if (!req.body.to || !req.body.content || !req.headers['x-access-token']) {
            res.json({success: false, message: "Error: request incomplete. Need: body.to ; body.content ; header.x-access-token"});
        } else {

            // check user access token
            User.findOne({
                token: req.headers['x-access-token'],
            }, function (err, auth_user) {
                if (err) return res.json({success: false, message: 'Error from db'});
                if (!auth_user) {
                    res.json({success: false, message: 'User not found.'});
                } else if (auth_user) {

                    // create message
                    let message = new Message({
                        to: req.body.to,
                        from: auth_user._id,
                        content: req.body.content,
                        timestamp: Date.now()
                    });

                    // save the message
                    message.save(function (err) {
                        if (err) throw err;
                        res.json({success: true});
                    });
                }
            });
        }
    });


    // route to get a conversation : parameters: with (a user ID)
    apiRoutes.get('/messagerie/conversation', function (req, res) {
       let messages = Array();
        // check if request is valid
        // params:
        //          headers.with: uID of the other user
        if (!req.headers['with'] || !req.headers['x-access-token']) {
            res.json({success: false, message: "Error: request incomplete"});
        } else {

            // check if user is valid
            User.findOne({
                token: req.headers['x-access-token'],
            }, function (err, auth_user) {
                if (err) return res.json({success: false, message: 'Error from db'});
                if (!auth_user) {
                    res.json({success: false, message: 'Bad token.'});
                } else if (auth_user) {

                    Message.find({from: auth_user._id, to: req.headers["with"]}, function (err, contacts) {
                        if (err) throw err;

                        if (contacts) {
                            messages = messages.concat(contacts);

                            Message.find({from: req.headers["with"], to: auth_user._id}, function (err, contacts) {
                                if (err) throw err;
                                if (contacts) {
                                    messages = messages.concat(contacts);
                                    res.json({success: true, messages: messages})
                                }   else if (!contacts) {
                                    res.json({success: true, messages: messages})
                                }
                            });
                        }  else if (!contacts) { // TODO REFACTOR
                            res.json({success: true, messages: messages})
                        }

                    });

                }
            });

        }
    });
};