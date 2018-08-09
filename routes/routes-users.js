const User          = require('../models/user'); // get our mongoose model
const Application = require('../models/applications/application');

/*          Modimo API - User management             */

module.exports = function(app, apiRoutes) {
    const jwt           = require('jsonwebtoken'); // used to create, sign, and verify tokens

// get current user
apiRoutes.get('/current-user', function(req, res) {

    User.findOne({token: req.headers['x-access-token']}, function(err, user) {
        if (err) return res.json({success: false, message: 'Error from db'});
        if (!user)
            res.json({success: false, message: 'User not found'})
        else
            res.json({success: true, user: user});
    });
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

    apiRoutes.delete('/user', function(req, res) { // TODO make this more safe

        User.findOne({token: req.headers['x-access-token']}, function(err, currentUser) {
            if (err) return res.json({success: false, message: 'Error from db'});
            else if (!currentUser || (!req.headers.user_id ))
                return res.json({success: false, message: 'Bad params'});
            else if (!currentUser.roles.includes("ROOT") || !currentUser.roles.includes("ADMIN"))
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
                                res.json({success: false, message: 'cant delete user'})
                        });
                });
            }
        });
    });
};