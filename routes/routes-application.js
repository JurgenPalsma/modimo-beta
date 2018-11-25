const Application   = require('../models/applications/application');
const Rates         = require('../models/applications/rates');
const User          = require('../models/user');
const Keywords      = require('../models/applications/keywords');
const Label         = require('../models/applications/label');
var async           = require('async');



module.exports = function(app, apiRoutes, io) {

    // route to post an application
    apiRoutes.post('/applications/application', function(req, res) {
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found'});
            else if (!req.body.name || !req.body.shortname || !req.body.logo || !req.body.mini_logo ||
                    !req.body.small_description || !req.body.description || !req.body.version || !req.body.label_name)
                return res.json({success: false, message: 'Informations missing'});
            else {
                let app = new Application({
                    name: req.body.name,
                    shortname: req.body.shortname,
                    link: req.body.link,
                    logo: req.body.logo,
                    rate_average: 0,
                    rate_count: 0,
                    mini_logo: req.body.mini_logo,
                    author_name: user.name,
                    keywords: req.body.keyword,
                    created_at: new Date(),
                    updated_at: new Date(),
                    small_description: req.body.small_description,
                    description: req.body.description,
                    version: req.body.version,
                    label_name: req.body.label_name
                });
                app.save(function(err) {
                    if (err) res.json({success: false, message: err.message});
                    else {
                        req.body.keyword.forEach(element=> {
                            let tmp = element.toUpperCase();
                            Keywords.findOne({
                                name: tmp
                            }, function (err, keyword) {
                                if (err) return res.json({success: false, message: 'Error from db'})
                                if (!keyword) {
                                    let keyword = new Keywords({
                                        name: tmp,
                                        application_id: app._id
                                    });
                                    keyword.save(function(err) {
                                        if (err) res.json({success: false, message: err.message});
                                    });
                                }
                                else {
                                    Keywords.update(
                                        {name: tmp},
                                        {$push: {application_id:app._id}},
                                        function(err) {
                                            if (err) {
                                                res.json({success: true, message: 'Keywords increment failed'})
                                            }
                                        });
                                }
                            });
                        });
                        req.body.label_name.forEach(element =>{
                            Label.update({
                                name: element}, {$push : {application_id:app._id}}, function(err) {
                                if (err) return res.json({success: false, message: 'Label update failed'})
                            });
                        });
                        res.json({success: true, message: 'Application creation sucessfull'});
                    }
                });

            }
        });
    });

        // route to patch application
        apiRoutes.patch('/applications/application', function(req, res) {
            if (!req.headers['application_id'])
                return res.json({success: false, message: 'Error: request incomplete'});
            User.findOne({
                token: req.headers['x-access-token'],
            }, function (err, user) {
                if (err) return res.json({success: false, message: 'Error from db'});
                if (!user)
                    res.json({success: false, message: 'User not found.'});
                else{
                    Application.findOne({
                        _id: req.headers['application_id']
                    }, function (err, application) {
                        if (err) return res.json({success: false, message: 'Error from db'})
                        if (!application)
                            return res.json({success: false, message: 'Application not found'})
                        Application.update({
                            _id: req.headers['application_id']}, {$push : {label_name:req.body.label_name}, $push : {keywords:req.body.keyword}, version:req.body.version, small_description:req.body.small_description, description:req.body.description, mini_logo:req.body.mini_logo, logo:req.body.logo, name:req.body.name, shortname:req.body.shortname, updated_at:new Date()}, function(err) {
                            if (!err) {
                                req.body.keyword.forEach(element=> {
                                    let tmp = element.toUpperCase();
                                    Keywords.findOne({
                                        name: tmp
                                    }, function (err, keyword) {
                                        if (err) return res.json({success: false, message: 'Error from db'})
                                        if (!keyword) {
                                            let keyword = new Keywords({
                                                name: tmp,
                                                application_id: app._id
                                            });
                                            keyword.save(function(err) {
                                                if (err) res.json({success: false, message: err.message});
                                            });
                                        }
                                        else {
                                            keyword.update(
                                                {name: tmp},
                                                {$push: {application_id:app._id}},
                                                function(err) {
                                                    if (err) {
                                                        res.json({success: true, message: 'Keywords increment failed'})
                                                    }
                                                });
                                        }
                                    });
                                });
                                req.body.label_name.forEach(element =>{
                                    Label.update({
                                        name: element}, {$push : {application_id:app._id}}, function(err) {
                                        if (err) return res.json({success: false, message: 'Label update failed'})
                                    });
                                });
                                res.json({success: true, message: 'Application update success'})
                            }
                            else
                                res.json({success: false, message: 'Application update Failed'})
                        });
                    });
                }
            });
        });

    // route to delete an application by its id
    apiRoutes.delete('/applications/application', function(req, res) {
        if (!req.headers['application_id'])
            return res.json({success: false, message: 'Error: request incomplete'});
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found'});
            else {
                Application.findOne({
                    _id: req.headers['application_id']
                }, function (err, app) {
                    if (err) return res.json({success: false, message: 'Error from db'})
                    if (!app)
                        return res.json({success: false, message: 'Application not found'})
                    else
                        app.remove({
                            _id: app.id
                        }, function(err) {
                            if (err) return res.json({success: true, message: 'Application removal failed'})
                            else {
                                Label.updateMany({
                                    application_id: req.headers['application_id']}, {$pull: { application_id:  req.headers['application_id'] } }, function(err) {
                                    if (err) return res.json({success: true, message: 'Label update failed'})
                                });
                                let tmp = app.keywords.map(function (e) {
                                    return e.toUpperCase();
                                });
                                tmp.forEach(element => {
                                    Keywords.findOne({
                                        name: element
                                    }, function (err, keyword) {
                                        if (err) return res.json({success: false, message: 'Error from db'})
                                        if (!keyword)
                                            return res.json({success: false, message: 'Keywords not found'})
                                        else {
                                            if (keyword.application_id.length == 1) {
                                                Keywords.remove({
                                                    name: element}, function(err) {
                                                    if (err)
                                                        return res.json({success: true, message: 'Keyword removal failed'})
                                                });
                                            }
                                            else {
                                                Keywords.update({
                                                    name: element}, {$pull: {application_id: req.headers['application_id']}}, function(err) {
                                                        if (err) {
                                                            res.json({success: true, message: 'Keywords remove failed'})
                                                        }
                                                    });
                                            }
                                        }
                                    });
                                });
                                User.updateMany({
                                    application_list: { "$in" : [req.headers['application_id']]}}, {$pull: { application_list:  req.headers['application_id'] } }, function(err) {
                                    if (err) return res.json({success: true, message: 'Label update failed'})
                                });
                                Rates.updateMany({
                                    application_id: req.headers['application_id']}, {$pull: { application_id:  req.headers['application_id'] } }, function(err) {
                                    if (err) return res.json({success: true, message: 'Label update failed'})
                                });
                                res.json({success: true, message: 'Application removal Sucessfull'})
                            }
                        });
                });
            }
        });
    });

    // route to get all applications
    apiRoutes.get('/applications', function(req, res) {
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found.'});
            else {
                Application.find({}, function (err, applications) {
                    if (err) return res.json({sucess: false, message: 'Error from db'});
                    if (applications.length == 0)
                        return res.json({sucess: false, message: 'Applications not found'});
                    else
                        return res.json({sucess: true, applications: applications});
                });

            }
        });
    });

    // route to get all applications of a user
   apiRoutes.get('/applications/user', function(req, res) {
       User.findOne({
           token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found.'});
            else {
                let applications = [];
                async.eachSeries(user.application_list, (element, callback) => {
                    Application.findOne({
                        _id: element
                    }, (err, application) => {
                        if (err) callback(err);
                        else if (application) {
                            applications.push(application);
                            callback()
                        }
                        else
                            callback('This user has a wrong application id in his application list: ' + element);
                    });
                }, (err) => {
                    if (err)
                        res.json({sucess: false, message: err});
                    else
                        res.json({success: true, applications: applications});
                });
           }
       });
   });

    // route to get an application by his link
    apiRoutes.get('/applications/link', function(req, res) {
        io.emit('salut', {msg:'raph'});
        if (!req.headers.application_link)
        return res.json({success: false, message:'Error: request incomplete'});
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                return res.json({success: false, message: 'User not found.'});
            else {
                Application.findOne({
                    link: req.headers.application_link
                }, function (err, application) {
                    if (err) return res.json({success: false, message: 'Error from db'});
                    if (!application)
                        return res.json({success: false, message: 'Applications not found'});
                    else
                        return res.json({success: true, application: application});
                });
            }
        });
    });

    // route to get one application by id
    apiRoutes.get('/applications/application', function(req, res) {
        if (!req.headers.application_id)
        return res.json({success: false, message:'Error: request incomplete'});
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found.'});
            else {
                Application.findOne({
                    _id: req.headers.application_id
                }, function (err, application) {
                    if (err) return res.json({success: false, message: 'Error from db'});
                    if (!application)
                        return res.json({success: false, message: 'Applications not found'});
                    else
                        return res.json({success: true, application: application});
                });
            }
        });
    });

        // route to get all applications by author_name
        apiRoutes.get('/applications/author', function(req, res) {
            if (!req.headers.author_name)
                return res.json({success: false, message:'Error: request incomplete'});
            User.findOne({
                token: req.headers['x-access-token'],
            }, function (err, user) {
                if (err) return res.json({success: false, message: 'Error from db'});
                if (!user)
                    res.json({success: false, message: 'User not found.'});
                else {
                    Application.find({
                        author_name: req.headers.author_name
                    }, function (err, applications) {
                    if (err) return res.json({sucess: false, message: 'Error from db'});
                    if (applications.length == 0)
                        return res.json({sucess: false, message: 'Applications not found'});
                    else
                        return res.json({sucess: true, applications: applications});
                    });
                }
            });
        });

    // route to create a label with empty list of app
    apiRoutes.post('/applications/labels', function(req, res) {
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found'});
            else if (!req.body.name)
                return res.json({success: false, message: 'Informations missing'});
            else {
                let label = new Label({
                    name: req.body.name
                });
                label.save(function(err) {
                    if (err) res.json({success: false, message: err.message});
                    else res.json({success: true});
                })
            }
        });
    });



    // route to delete a label
    apiRoutes.delete('/applications/label', function(req, res) {
        if (!req.body.label_id)
            return res.json({success: false, message: 'Error: request incomplete'});
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found.'});
            else {
                Label.remove({
                    _id: req.body.label_id}, function(err) {
                    if (!err)
                        res.json({success: true, message: 'Label removal success'})
                    else
                        res.json({success: false, message: 'Label removal Failed'})
                });
            }
        });
    });

    // route to get a label by label name
    apiRoutes.get('/applications/labels/', function(req, res) {
        if (!req.headers.name)
            return res.json({success: false, message:'Error: request incomplete'});
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found.'});
            else {
                Label.find({
                    name: req.headers.name
                }, function (err, label) {
                    if (err) return res.json({sucess: false, message: 'Error from db'});
                    if (label.length == 0)
                        return res.json({sucess: false, message: 'Label not found'});
                    else
                        return res.json({sucess: true, label: label});
                });
            }
        });
    });

    // route research applications corresponding with a name of research
    apiRoutes.get('/applications/applications/', function(req, res) {
        if (!req.headers.name)
            return res.json({success: false, message:'Error: request incomplete'});
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found.'});
            else {
                Application.find({
                    $or:[{name: {$regex: ".*" + req.headers.name + ".*", $options : 'i'}},
                    {keywords: {$regex: ".*" + req.headers.name + ".*", $options : 'i'}},
                    {label_name: {$regex: ".*" + req.headers.name + ".*", $options : 'i'}}]
                }, function (err, apps) {
                    if (err) return res.json({sucess: false, message: 'Error from db'});
                    if (apps.length == 0)
                        return res.json({sucess: false, message: 'Applications not found'});
                    else
                        return res.json({sucess: true, applications: apps});
                });
            }
        });
    });

    // route to get all labels name
    apiRoutes.get('/applications/labels/all', function(req, res) {
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found.'});
            else {
                Label.find({
                }, function (err, label) {
                    if (err) return res.json({sucess: false, message: 'Error from db'});
                    if (label.length == 0)
                        return res.json({sucess: false, message: 'Label not found'});
                    else
                        return res.json({sucess: true, labels: label});
                });
            }
        });
    });

    // route to post an application rates from an application_id
    apiRoutes.post('/applications/rates', function(req, res) {
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found'});
            else if (!req.body.application_id || !req.body.stars || !req.body.quote || !req.body.comment)
                return res.json({success: false, message: 'Informations missing'});
            else {
                Application.findOne({
                    _id: req.body.application_id
                }, function (err, application) {
                    if (err) return res.json({success: false, message: 'Error from db'});
                    if (!application)
                        return res.json({success: false, message: 'application_id false'});
                    else {
                        let rates = new Rates({
                            stars: req.body.stars,
                            comment: req.body.comment,
                            author_id: user._id,
                            author_name: user.name,
                            quote: req.body.quote,
                            application_id: req.body.application_id
                        });
                        rates.save(function(err) {
                            if (err) return res.json({success: false, message: err.message});
                            else {
                                Application.update({
                                    _id: req.body.application_id},
                                    {rate_average: (((application.rate_average * application.rate_count) + rates.stars) / (application.rate_count + 1)),
                                    $inc: {rate_count: 1}
                                    },function (err) {
                                        if (err) {
                                            return res.json({success: false, message: 'Update application failed'})
                                        }
                                });
                                res.json({success: true});
                            }
                        });
                    }
                });
            }
        });
    });

    // route to delete a rates in application with rate_id and application_id
    apiRoutes.delete('/applications/rates', function(req, res) {
        if (!req.body.rate_id || !req.body.application_id)
            return res.json({success: false, message: 'Error: request incomplete'});
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                return res.json({success: false, message: 'User not found.'});
            else {
                Rates.findOne({
                    _id: req.body.rate_id
                }, function (err, rate) {
                    if (err) return res.json({success: false, message: 'Error from db'})
                    if (!rate)
                        return res.json({success: false, message: 'Rate not found'})
                    else {
                        Rates.remove({
                            _id: rate._id}, function(err) {
                            if (!err) {
                                Application.findOne({
                                    _id: req.body.application_id},
                                    function(err, application) {
                                        if (err) return res.json({success: false, message: 'Application not found'});
                                        else {
                                            Application.update({
                                                _id: req.body.application_id},
                                                {rate_average: ((application.rate_average * application.rate_count) - rate.stars) / ((application.rate_count - 1) || 1),
                                                $inc: {rate_count: -1}
                                                },function (err) {
                                                    if (err) {
                                                        return res.json({success: false, message: 'Remove application failed'})
                                                    }
                                                    return res.json({success: true, message: 'Rate removal success'})
                                            });
                                        }
                                    });
                            }
                            else
                                res.json({success: false, message: 'Rate removal Failed'})
                        });
                    }
                });
            }
        });
    });

    // route to update a rate in an app by his id
    apiRoutes.patch('/applications/rates', function(req, res) {
        if (!req.body.rate_id || !req.body.stars || !req.body.comment || !req.body.quote)
            return res.json({success: false, message: 'Error: request incomplete'});
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found.'});
            else{
                Rates.findOne({
                    _id: req.body.rate_id
                }, function (err, rate) {
                    if (err) return res.json({success: false, message: 'Error from db'})
                    if (!rate)
                        return res.json({success: false, message: 'Rate not found'})
                    else if (rate.author_id == user.id)
                        Rates.update({
                        _id:rate._id},{comment:req.body.comment, stars:req.body.stars, quote:req.body.quote}, function(err) {
                            if (!err) {
                                if (req.body.stars != rate.stars) {
                                    Application.findOne({
                                        _id: rate.application_id},
                                        function (err, application) {
                                            if (err) {
                                                return res.json({success: false, message: 'Update rate failed'});
                                            }
                                            else {
                                                Application.update({
                                                    _id: rate.application_id},
                                                    {rate_average: application.rate_average + ((req.body.stars - rate.stars) / application.rate_count)
                                                    },function (err) {
                                                        if (err) {
                                                            return res.json({success: false, message: 'Update rate failed'})
                                                        }
                                                });
                                            }
                                        });
                                }
                                res.json({success: true, message: 'Rate update success'})
                            }
                            else
                                res.json({success: false, message: 'Rate update Failed'})
                        });
                    else
                        return res.json({success: false, message: 'You must be the author of the rate to edit it'})
                });
            }
        });
    });

    // route to get all application rates from an application id
    apiRoutes.get('/applications/rates', function(req, res) {
        if (!req.headers.application_id)
            return res.json({success: false, message:'Error: request incomplete'});
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found.'});
            else {
                Rates.find({
                    application_id: req.headers.application_id
                }, function (err, rates) {
                    if (err) return res.json({sucess: false, message: 'Error from db'});
                    else
                        return res.json({sucess: true, rates: rates});
                });
            }
        });
    });

    // route to get all keywords from a keyword name or get all keyword list
    apiRoutes.get('/applications/keywords', function(req, res) {
        let i = 0;
        if (!req.headers.keyword)
            i = 1;
        User.findOne({
            token: req.headers['x-access-token'],
        }, function (err, user) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!user)
                res.json({success: false, message: 'User not found.'});
            else {
                if (i == 0) {
                    let tmp = req.headers.keyword.toUpperCase();
                    Keywords.find({
                    name: {$regex: tmp}
                    }, function (err, keywords) {
                        if (err) return res.json({sucess: false, message: err.message});
                        if (keywords.length == 0)
                            return res.json({sucess: false, message: 'Keyword not found'});
                        else
                            return res.json({sucess: true, keyword: keywords});
                    });
                }
                else {
                    Keywords.find({
                    }, function (err, keywords) {
                        if (err) return res.json({sucess: false, message: err.message});
                        if (keywords.length == 0)
                            return res.json({sucess: false, message: 'Keyword not found'});
                        else
                            return res.json({sucess: true, keyword: keywords});
                    });
                }
            }
        });
    });
}
