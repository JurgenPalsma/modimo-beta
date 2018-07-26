const User          = require('../models/user'); // get our mongoose model
const Notif         = require('../functions/notifications');

/*          Modimo API - Authentification              */

module.exports = function(app, apiRoutes) {
    const jwt           = require('jsonwebtoken'); // used to create, sign, and verify tokens

    // route to authenticate a user
    apiRoutes.post('/authenticate', function (req, res) {

        // find the user
        User.findOne({
            email: req.body.email,
        }, function (err, user) {

            if (err) throw err;

            if (!user) {
                return res.json({success: false, message: 'Authentication failed. User ' +  req.body + ' not found.'});
            } else if (user) {

                // check if password matches
                if (user.password != req.body.password) {
                    return res.json({success: false, message: 'Authentication failed. Wrong password.'});
                } else {

                    // if user is found and password is right
                    // create a token with only our given payload
                    // we don't want to pass in the entire user since that has the password
                    const payload = {
                        admin: user.admin
                    };
                    let token = jwt.sign(payload, app.get('superSecret'), {
                        expiresIn: 60 * 60 * 24
                    });
                    user.token.push(token)
                    user.save(function (err) {
                        if(err) {
                            res.json({
                                success: false,
                                message: 'Could not update user'
                            })
                        } else {
                            Notif.getNotif(user.id, "false", function(err, notifications){
                              if (err) {
                                return res.json({success: true, message: 'Enjoy your fresh token', token: token})
                              }
                              else {
                                return res.json({success: true, message: 'Enjoy your fresh token', token: token, notifs: notifications})
                              }
                            })
                        }
                    });
                }

            }

        });
    });

    apiRoutes.use(function(req,res,next){
        let _send = res.send;
        let sent = false;
        res.send = function(data){
            if(sent) return;
            _send.bind(res)(data);
            sent = true;
        };
        next();
    });

    // route middleware to verify a token
    apiRoutes.use(function (req, res, next) {

        // check header or url parameters or post parameters for token
        let token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                if (err) {
                    return res.json({success: false, message: 'Failed to authenticate token.'});
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    req.next()
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });

    // route to logout
    apiRoutes.post('/logout', function (req, res) {
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
                    auth_user.token.splice(auth_user.token.indexOf(req.headers['x-access-token']), 1) ;

                    auth_user.save(function (err) {
                        if(err) {
                            return res.json({
                                success: false,
                                message: 'Could not update user'
                            })
                        } else
                            res.json({success: true})
                    });

                }
            });

        }
    });

};
