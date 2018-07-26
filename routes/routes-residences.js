const Residence     = require('../models/residence'); // get our mongoose model
const User          = require('../models/user'); // get our mongoose model

/*          Modimo API - User management             */

module.exports = function(app, apiRoutes) {
    const jwt           = require('jsonwebtoken'); // used to create, sign, and verify tokens

    apiRoutes.post('/residence', function(req, res) {

        if (!req.headers['x-access-token'] ||
            !req.body.name ||               // residence name
            !req.body.default_app_ids ||    // list of ids of res' default apps
            !req.body.caretaker_name  ||    // res' caretaker's name
            !req.body.caretaker_email  ||   // res' caretaker's email
            !req.body.caretaker_password    // res' caretaker's password
        ) {
            res.json({success: false, message: "Error: request incomplete."});
        } else {
            User.findOne({token: req.headers['x-access-token']}, function(err, currentUser) {
                if (err) return res.json({success: false, message: 'Error from db'});
                if (!currentUser)
                    return res.json({success: false, message: 'User not found'});
                else if (!currentUser.roles.includes("ROOT"))
                    return res.json({success: false, message: 'Permission denied'});
                else
                {
                    // create the resi's caretaker

                    let caretaker = new User({
                        name: req.body.caretaker_name,
                        password: req.body.caretaker_password,
                        application_list: req.body.default_app_ids,
                        email: req.body.caretaker_email,
                        roles: ["CARETAKER"]
                    });

                    // create res
                    let residence = new Residence({
                        name: req.body.name,
                        caretaker_id: caretaker._id
                    });

                    req.body.default_app_ids.forEach(element => {
                        residence.default_app_ids.push(element);
                    });

                    // save the res
                    if ((residence.save()).hasWriteError)
                        return (res.json({success: false, message: "Db not writable"}))
                    else {
                        caretaker.residence = residence._id;
                        if ((caretaker.save()).hasWriteError)
                            return (res.json({success: false, message: "Db not writable"}))
                        return (res.json({success: true, residence: residence}))
                    }
                }
            });
        }
    });

    // UNSAFE: gives caretaker's password
    apiRoutes.get('/residence/caretaker', function(req, res) {

        if (!req.headers['x-access-token'] ||   // user's access token
            !req.headers['name']                      // residence name
        ) {
            res.json({success: false, message: "Error: request incomplete."});
        } else {
            User.findOne({token: req.headers['x-access-token']}, function(err, currentUser) {
                if (err) return res.json({success: false, message: 'Error from db'});
                if (!currentUser)
                    return res.json({success: false, message: 'User not found'});
                else {

                    Residence.findOne({
                        name: req.headers['name'],
                    }, function (err, residence) {
                        if (err) return res.json({success: false, message: 'Error from db'});
                        if (!residence) {
                            return res.json({success: false, message: 'Residence not found.'})
                        } else if (residence) {

                            User.findOne({
                                _id: residence.caretaker_id,
                            }, function (err, caretaker) {
                                if (err) return res.json({success: false, message: 'Error from db'});
                                if (!caretaker) {
                                    return res.json({success: false, message: 'Residence not found.'})
                                } else if (caretaker) {
                                    return res.json({success: true, caretaker: caretaker});
                                }
                            });
                        }
                    });
                }
            });
        }
    });


    // UNSAFE: gives caretaker's password
    apiRoutes.get('/residence/users', function(req, res) {

        if (!req.headers['x-access-token'] ||   // user's access token
            !req.headers['residence_id']                      // residence name
        ) {
            res.json({success: false, message: "Error: request incomplete."});
        } else {
            User.findOne({token: req.headers['x-access-token']}, function(err, currentUser) {
                if (err) return res.json({success: false, message: 'Error from db'});
                else if (!currentUser)
                    return res.json({success: false, message: 'User not found'});
                else if (!currentUser.roles.includes("ROOT") && !currentUser.roles.includes("ADMIN")) // TODO make sure only admin of resi can access this
                    return res.json({success: false, message: 'Permission denied'});
                else {
                    User.find({
                        residence: req.headers['residence_id'],
                    }, function (err, users) {
                        if (err) return res.json({success: false, message: 'Error from db'});
                        if (!users || users.length == 0) {
                            return res.json({success: false, message: 'No users found with this residence_id.'})
                        } else if (users) {
                            return res.json({success: true, users: users})
                        }
                    });
                }
            });
        }
    });

};