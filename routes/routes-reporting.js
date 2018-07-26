const User          = require('../models/user');
const Reporting     = require('../models/reporting');

module.exports = function(app, apiRoutes) {

    apiRoutes.get('/reporting/reporting', function(req, res) {     
        User.findOne({token: req.headers['x-access-token']
        }, function (err, user) {
          if (err) return res.json({success: false, message: 'Error from db'});
          else if (!user) return res.json({success: false, message: 'User not found.'});
          else if (!req.headers.residence || !req.headers.language) return res.json({success: false, message: 'Missing params'});
          else {
            Reporting.find({
                residence: req.headers.residence,
                language: req.headers.language
              }, function(err, reporting) {
                if (err) return res.json({success: false, message: 'Db problem', dberror: err});
                else if (reporting === undefined || reporting.length == 0) return res.json({success: false, message: 'Reporting not found'});
                else return res.json({success: true, reporting: reporting});
            });   
          }
        });
    });

    apiRoutes.post('/reporting/reporting', function(req, res) {
        if (!req.body.link || !req.body.residence || !req.body.language) return res.json({success: false, message: 'Error: request incomplete'});
        else {
            User.findOne({token: req.headers['x-access-token']}, function (err, user) {
                if (err) throw err;
                else if (!user) return res.json({success: false, message: 'User not found'});
                else if (!user.roles.includes("ROOT")) return res.json({success: false, message: 'Access denied'});
                else { // todo: check if reporting exists
                    Reporting.find({
                        link: req.body.link,
                        residence: req.body.residence,
                        language: req.body.language
                      }, function(err, reporting) {
                        if (err) return res.json({success: false, message: 'Db problem', dberror: err});
                        else if (reporting === undefined || reporting.length == 0) {
                            let reporting = new Reporting({
                                link: req.body.link,
                                residence: req.body.residence,
                                language: req.body.language
                              });
                              reporting.save(function(err) {
                                if (err) return res.json({success: false, message: 'Db problem', dberror: err});
                                else return res.json({success: true, reporting: reporting});
                            });
                        }
                        else return res.json({success: false, message: 'Reporting already exists', reporting: reporting});
                    }); 
              }
            });
        }
    });

    apiRoutes.put('/reporting/reporting', function(req, res) {
        if (!req.body.id || !req.body.link || !req.body.residence || !req.body.language) return res.json({success: false, message: 'Error: request incomplete'});
        else {
            User.findOne({token: req.headers['x-access-token']}, function (err, user) {
                if (err) throw err;
                else if (!user) return res.json({success: false, message: 'User not found'});
                else if (!user.roles.includes("ROOT")) return res.json({success: false, message: 'Access denied'});
                else { 
                    Reporting.findOneAndUpdate({_id: req.body.id},{   
                        link: req.body.link,
                        residence: req.body.residence,
                        language: req.body.language}, 
                        function(err, reporting) {
                            if (err) return res.json({success: false, message: 'Db problem', dberror: err});
                            else return res.json({success: true, oldreporting: reporting});
                        });
                }
            });
        }
    });

};