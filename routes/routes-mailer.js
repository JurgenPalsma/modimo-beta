const Residence     = require('../models/residence'); // get our mongoose model
const User          = require('../models/user'); // get our mongoose model

const mailer      = require('../functions/mailer')

module.exports = function(app, apiRoutes) {

    // post simple mail
    apiRoutes.post('/mail', function(req, res) {
        
      if (!req.headers['x-access-token'] ||   // user's access token
            !req.body.to ||
            !req.body.subject ||
            !req.body.text
        ) {
            res.json({success: false, message: "Error: request incomplete."});
        } else {
            User.findOne({token: req.headers['x-access-token']}, function(err, currentUser) {
                if (err) return res.json({success: false, message: 'Error from db'});
                else if (!currentUser)
                    return res.json({success: false, message: 'User not found'});
                else if (!currentUser.roles.includes("ROOT") && !currentUser.roles.includes("ADMIN") && !currentUser.roles.includes("CARETAKER")) // Modimo only
                    return res.json({success: false, message: 'Permission denied'});
                else {
                    if (req.body.to == "resident")
                    {
                      User.find({roles: "RESIDENT", residence :currentUser.residence},function(err, users) {
                          if (err) return {success: false, message: 'Error from db'};
                          else {
                              users.forEach(function(element) {
                                  mailer.sendSGEmail(element.email, req.body.subject, req.body.text, res);
                                });
                          }
                        })
                    }
                    else if (req.body.to == "admin")
                    {
                      User.find({roles: "ADMIN", residence :currentUser.residence},function(err, users) {
                          if (err) return {success: false, message: 'Error from db'};
                          else {
                              users.forEach(function(element) {
                                  mailer.sendSGEmail(element.email, req.body.subject, req.body.text, res);
                                });
                          }
                        })
                    }
                    else
                    mailer.sendSGEmail(req.body.to, req.body.subject, req.body.text, res);
                }
            });
        }
    });

    // test a nice templated mail
    apiRoutes.post('/nicemail', function(req, res) {
        
        if (!req.headers['x-access-token'] ||   // user's access token
              !req.body.to ||
              !req.body.subject
            ) {
              res.json({success: false, message: "Error: request incomplete."});
          } else {
              User.findOne({token: req.headers['x-access-token']}, function(err, currentUser) {
                  if (err) return res.json({success: false, message: 'Error from db'});
                  else if (!currentUser)
                      return res.json({success: false, message: 'User not found'});
                  else if (!currentUser.roles.includes("ROOT")) // Modimo only
                      return res.json({success: false, message: 'Permission denied'});
                  else {
                    mailer.sendSyncTemplatedSGEmail(req.body.to, req.body.subject, sub={name:'John'}, templateId= '43893a65-6e79-4630-acd8-be76286ae2e7');
                    return res.json({success: true, message: 'ok'});
                  }
              });
          }
      });
}