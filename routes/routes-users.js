const User          = require('../models/user');
const Application = require('../models/applications/application');
const Residence     = require('../models/residence');
const Notif         = require('../functions/notifications');
const welcome_messages  = require('../config/welcome_messages');
const mailer      = require('../functions/mailer')

/*          Modimo API - User management             */

module.exports = function(app, apiRoutes) {
    const jwt           = require('jsonwebtoken'); // used to create, sign, and verify tokens

// get current user
apiRoutes.get('/current-user', function(req, res) {
    User.findOne({token: req.headers['x-access-token']}, function(err, user) {
        if (err) return res.json({success: false, message: 'Error from db'});
        if (!user)
            res.json({success: false, message: 'User not found'})
        else {
          Notif.getNotif(user.id, false, function(err, notifications){
            if (err) {
              return res.json({success: true, user: user});
            }
            else {
              res.json({success: true, user: user, notifs: notifications});
            }
          })
        }
    });
});

apiRoutes.post('/admin_register_user', function(req, res) {
    if ((req.body.name || (req.body.firstname && req.body.lastname))
        && req.body.email
        && req.body.residence_id
        && req.body.roles) {
            User.findOne({token: req.headers['x-access-token']}, function (err, user) {
                if (err) throw err;
                else if (!user)
                    res.json({success: false, message: 'User not authorised'});
                else {
                    // Check user roles
                    // Check email
                    // Create user
                    // Send email
                    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (!re.test(String(req.body.email).toLowerCase())) {return res.json({success: false, message: 'bad param: email'});}

                    // check if user exists
                    User.findOne({ email: req.body.email, residence: req.body.residence_id }, function(err, user) {
                        if (err) throw err;
                        if (user) {
                            return res.json({success: false, message: 'User already exists'});
                        } else {

                            // check if resi exists
                            Residence.findOne({
                                _id: req.body.residence_id,
                            }, function (err, residence) {
                                if (err) return res.json({success: false, message: 'Error from db'});
                                if (!residence) {
                                    return res.json({success: false, message: 'Residence not found.'})
                                } else if (residence) {
                                    const payload = {
                                        name: req.body.name ? req.body.name : req.body.lastname
                                    };
                                    let token = jwt.sign(payload, app.get('superSecret'), {
                                        expiresIn: 60 * 60 * 24
                                    });
                                    token = token.substring(0, 7)

                                    // create user
                                    let user = new User({
                                        name: req.body.name ? req.body.name : "",
                                        first_name: req.body.firstname ? req.body.firstname : "",
                                        last_name: req.body.lastname ? req.body.lastname : "",
                                        password: token,
                                        email: req.body.email,
                                        residence: req.body.residence_id,
                                        roles: req.body.roles,
                                        created_at: new Date(),
                                        application_list: residence.default_app_ids,
                                    });

                                    // save the user
                                    user.save(function(err) {
                                        if (err) throw err;

                                        // get user's caretaker's ID first
                                        User.findOne({
                                            _id: residence.caretaker_id,
                                        }, function (err, caretaker) {
                                            if (err) return res.json({success: false, message: 'Error from db'});
                                            if (!caretaker) {
                                                return res.json({success: false, message: 'Caretaker not found.'})
                                            } else if (caretaker) {
                                            if (mailer.sendSyncTemplatedSGEmail(to=user.email, subject='On vous a inscrit dans la résidence 2.0', sub={gardien: caretaker.name, 'name': user.name, email: user.email, password: user.password}, templateId= '43893a65-6e79-4630-acd8-be76286ae2e7'))
                                                return res.json({success: true, message: "User registered"});
                                            else
                                                return res.json({success: false, message: "Registration mail not sent"});
                                            }
                                        });
                                    });
                                }
                            });
                        }});


                }
            });
    }
    else res.json({success: false, message: 'Incomplete request. Need: (req.body.name || (req.body.firstname && req.body.lastname)) && req.body.email  && req.body.residence_id && req.body.roles'});
});

// get user by id
apiRoutes.get('/user', function(req, res) {
    User.findOne({token: req.headers['x-access-token']}, function(err, currentUser) {
        if (err) return res.json({success: false, message: 'Error from db'});
        if (!currentUser || (!req.headers.user_id && !req.headers.email))
            res.json({success: false, message: 'Bad params'})
        else {
            let params = {};
            req.headers.user_id ? params = {_id: req.headers.user_id} : params = {email: req.headers.email};
            User.findOne(params, function (err, user) {
                if (err) return res.json({success: false, message: 'Error from db'});
                if (!user)
                    res.json({success: false, message: 'User not found'});
                else
                    res.json({success: true, user: user});
            });
        }
    });
});

// modify user's data if current user
apiRoutes.patch('/user', function(req, res) {
    if (req.body.user) {
        u = JSON.parse(req.body.user)
        User.findOne({
            token: req.headers['x-access-token'],
            }, function (err, user) {
                if (err) return res.json({success: false, message: 'Error from db'});
                else if (!user) return res.json({success: false, message: 'User not found'});
                else if (user._id != u._id.$oid && !user.roles.includes("ADMIN")) return res.json({success: false, message: 'You can only edit your own user'});
                else {
                    u = JSON.parse(req.body.user);
                    User.update({_id: u._id}, {
                            name: u.name,
                            email: u.email,
                            appartment: u.appartment,
                            spammable: u.spammable

                        }, function(err) {
                        if (!err) res.json({success: true, message: 'User updated'})
                        else res.json({success: false, message: "User update failed"})
                    });
                }
            });
    }
});


// route to add an app in list of app
apiRoutes.patch('/user/application/add', function(req, res) {
    User.findOne({
    token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found'});
            else if (!req.body.application_id)
                return res.json({success: false, message: 'Informations missing'});
            else {
                if (user.application_list.indexOf(req.body.application_id) != -1)
                    return res.json({success: false, message: 'Application already in the list'});
                else {
                    User.update({
                        _id: user._id}, {$push : {application_list: req.body.application_id}}, function(err) {
                        if (err) return res.json({success: false, message: 'Application added failed'})
                        else return res.json({success: true, message: 'Application added sucessfull'})
                    });
                }
            }
        });
    });

    // route to delete an app in list of app
    apiRoutes.patch('/user/application/delete', function(req, res) {
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found'});
            else if (!req.body.application_id)
                return res.json({success: false, message: 'Informations missing'});
            else {
                if (user.application_list.indexOf(req.body.application_id) == -1)
                    return res.json({success: false, message: 'Application is not in the list'});
                User.update({
                    _id: user._id}, {$pull : {application_list: req.body.application_id}}, function(err) {
                    if (err) return res.json({success: false, message: 'Application delete failed'})
                    else return res.json({success: true, message: 'Application delete sucessfull'})
                });
            }
        });
    });

    // get users by residenceId
    apiRoutes.get('/users', function(req, res) {
        User.findOne({token: req.headers['x-access-token']}, function(err, currentUser) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!currentUser || !req.headers.residence_id) res.json({success: false, message: 'Bad params', currentUser : req.headers.residenceId})
            else {
                let params = {residence: req.headers.residence_id};
                User.find(params, function (err, users) {
                    if (err) return res.json({success: false, message: 'Error from db, check your residence ID'});
                    if (!users)
                        res.json({success: false, message: 'Invalid residence ID'});
                    else
                        res.json({success: true, users: users});
                });
            }
        });
    });

    apiRoutes.delete('/user', function(req, res) { // TODO make this more safe

        User.findOne({token: req.headers['x-access-token']}, function(err, currentUser) {
            if (err) return res.json({success: false, message: 'Error from db'});
            else if (!currentUser || (!req.headers.user_id ))
                return res.json({success: false, message: 'Bad params'});
            else if (!currentUser.roles.includes("ROOT") && !currentUser.roles.includes("ADMIN") && !currentUser.roles.includes("CARETAKER"))
                return res.json({success: false, message: 'Access denied'});
            else {
                User.findOne({
                    _id: req.headers.user_id
                }, function (err, user) {
                    if (err) return res.json({success: false, message: 'Error from db'})
                    if (!user)
                        return res.json({success: false, message: 'User not found'})
                    else
                        User.remove({
                            _id: user.id}, function(err) {
                            if (!err)
                                res.json({success: true, message: 'User removed'})
                            else
                                res.json({success: false, message: 'cannot delete user'})
                        });
                });
            }
        });
    });
};
