const Info = require('../models/billboard/informations');
const User = require('../models/user');
const Comment = require('../models/comment');

module.exports = function (app, apiRoutes) {
    // route to add a post to billboard
    apiRoutes.post('/infos/info', function (req, res) {

        if (!req.body.title || !req.body.content)
            return res.json({
                success: false,
                message: 'Error: request incomplete'
            });
        else
            User.findOne({
                token: req.headers['x-access-token']
            }, function (err, user) {
                if (err)
                    throw err;
                if (!user)
                    return res.json({
                        success: false,
                        message: 'Bad auth token'
                    });
                else {
                    let info = new Info({
                        author_id: user._id,
                        author_name: user.name,
                        info_type: 'info',
                        title: req.body.title,
                        content: req.body.content,
                        created_at: new Date(),
                        updated_at: new Date(),
                        residence: user.residence
                    });
                    info.save(function (err) {
                        if (err)
                            return res.json({
                                success: false,
                                message: err.message
                            });
                        else
                            return res.json({
                                success: true,
                                info: info
                            });
                    });
                }
            });
    });

    // route to get list of info
    apiRoutes.get('/infos', function (req, res) {
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err)
                return res.json({
                    success: false,
                    message: 'Error from db'
                });
            if (!user)
                return res.json({
                    success: false,
                    message: 'User not found.'
                });
            else if (req.headers.author_id)
                Info.find({
                    author_id: req.headers.author_id
                }, function (err, infos) {
                    if (err)
                        throw err;
                    var infos_residence = [];
                    for (var i = 0; i < infos.length; i++) {
                        if (infos[i].residence == user.residence)
                            infos_residence.push(infos[i]);
                    }
                    return res.json({
                        success: true,
                        infos: infos_residence
                    });
                })
            else
                Info.find({}, function (err, infos) {
                    if (err) throw err;
                    var infos_residence = [];
                    for (var i = 0; i < infos.length; i++) {
                        if (infos[i].residence == user.residence)
                            infos_residence.push(infos[i]);
                    }
                    return res.json({
                        success: true,
                        infos: infos_residence
                    });
                });
        });
    });

    // route to get info with specified id
    apiRoutes.get('/infos/info', function (req, res) {
        if (!req.headers['info_id'])
            return res.json({
                success: false,
                message: 'Error: request incomplete'
            });
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err)
                return res.json({
                    success: false,
                    message: 'Error from db'
                });
            if (!user)
                res.json({
                    success: false,
                    message: 'User not found.'
                });
            else {
                Info.findOne({
                    _id: req.headers.info_id
                }, function (err, info) {
                    if (err)
                        return res.json({
                            success: false,
                            message: 'Error from db'
                        });
                    if (!info)
                        return res.json({
                            success: false,
                            message: 'info not found'
                        })
                    else
                        return res.json({
                            success: true,
                            info: info
                        });
                });
            }
        });
    });

    // route to modify info with id
    apiRoutes.patch('/infos/info', function (req, res) {
        if (!req.body.info_id || !req.body.title || !req.body.content)
            return res.json({
                success: false,
                message: 'Error: request incomplete'
            });
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({
                success: false,
                message: 'Error from db'
            });
            if (!user)
                res.json({
                    success: false,
                    message: 'User not found.'
                });
            else {
                Info.findOne({
                    _id: req.body.info_id
                }, function (err, info) {
                    if (err) return res.json({
                        success: false,
                        message: 'Error from db'
                    })
                    if (!info)
                        return res.json({
                            success: false,
                            message: 'Info not found'
                        })
                    else if (info.author_id == user.id) {
                        Info.update({
                            _id: info.id
                        }, {
                                content: req.body.content,
                                title: req.body.title,
                                updated_at: new Date()
                            }, function (err) {
                                if (!err) {
                                    return res.json({
                                        success: true,
                                        message: 'Info update success'
                                    })
                                } else
                                    return res.json({
                                        success: false,
                                        message: 'Info update Failed'
                                    })
                            });
                    } else
                        return res.json({
                            success: false,
                            message: 'You must be the author of the info to edit it'
                        })
                });
            }
        });
    });

    // route to delete info with id
    apiRoutes.delete('/infos/info', function (req, res) {
        if (!req.headers.info_id)
            return res.json({
                success: false,
                message: 'Error: request incomplete'
            });
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err)
                return res.json({
                    success: false,
                    message: 'Error from db'
                });
            if (!user)
                return res.json({
                    success: false,
                    message: 'User not found.'
                });
            else {
                Info.findOne({
                    _id: req.headers.info_id
                }, function (err, info) {
                    if (err) return res.json({
                        success: false,
                        message: 'Error from db'
                    })
                    if (!info)
                        return res.json({
                            success: false,
                            message: 'Info not found'
                        })
                    else {
                        Comment.remove({
                            $and: [{
                                parent_id: info.id
                            }, {
                                parent_name: 'info'
                            }]
                        }, function (err) {
                            if (!err) {
                                Info.remove({
                                    _id: info.id
                                }, function (err) {
                                    if (!err)
                                        return res.json({
                                            success: true,
                                            message: 'Info removal success'
                                        })
                                    else
                                        return res.json({
                                            success: false,
                                            message: 'Info removal Failed'
                                        })
                                });

                            } else
                                return res.json({
                                    success: false,
                                    message: 'Ticket removal Failed'
                                });
                        });
                    }
                });
            }
        });
    });
}