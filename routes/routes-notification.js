const Application     = require('../models/applications/application');
const Rates           = require('../models/applications/rates');
const User            = require('../models/user');
const Keywords        = require('../models/applications/keywords');
const Label           = require('../models/applications/label');
const Notification    = require('../models/notifications/notification');
var async             = require('async');


module.exports = function(app, apiRoutes, io) {

//---------------------------------------API CALLS FOR NOTIFICATIONS------------------------------------------
//---------------------------------------POST NOTIFICATION----------------------------------------------------------

apiRoutes.post('/notifications/notification', function(req, res) {
      console.log(req.body)
      if (!req.body.title || !req.body.subject_id || !req.body.link || !req.body.type || !req.body.action)
        return res.json({success: false, message: 'Error: request incomplete'});
      else
        User.findOne({token: req.headers['x-access-token']}, function (err, user) {
          if (err) throw err;
          else if (!user)
            return res.json({success: false, message: 'Bad auth token'});
          else {
            let notification = new Notification({
              title: req.body.title,
              has_read: false,
              actor_id: user._id,
              actor_name: user.user_name,
              subject_id: req.body.subject_id,
              link: req.body.link,
              type: req.body.type,
              is_display: req.body.is_display,
              object: req.body.object,
              created_at: new Date(),
              subject_residence: req.body.subject_residence,
            });
            notification.save(function(err) {
              if (err) return res.json({success: false, message: err.message});
              else return res.json({success: true});
          });
        }
      });
  });

//---------------------------------------GET NOTIFICATION FOR A USER------------------------------------------------

apiRoutes.get('/notifications/notifications', function(req, res) {
  User.findOne({
    token: req.headers['x-access-token'],
  }, function (err, user) {
    if (err) return res.json({success: false, message: 'Error from db'});
    else if (!user)
      return res.json({success: false, message: 'User not found.'});
    else if (!req.headers.notif_statue)
      Notification.find({
        subject_id: user._id
      }, function(err, notifs) {
        if (err) throw err;
        return res.json({success: true, notifs: notifs});
      })
    else if (req.headers.notif_statue)
      Notification.find({
        subject_id: user._id,
        has_read: req.headers.notif_statue
      }, function(err, notifs) {
        if (err) throw err;
        return res.json({success: true, notifs: notifs});
      })
  });
});

//---------------------------------------PATCH NOTIFICATION --------------------------------------------

  apiRoutes.patch('/notifications/notification', function(req, res) {
    if (!req.body.notif_id || !req.body.param)
      return res.json({success: false, message: 'Error: request incomplete'});
    User.findOne({
      token: req.headers['x-access-token'],
    }, function (err, user) {
      if (err) return res.json({success: false, message: 'Error from db'});
      else if (!user)
        return res.json({success: false, message: 'User not found.'});
      else{
        Notification.findOne({
          _id: req.body.notif_id
        }, function (err, notif) {
          if (err) return res.json({success: false, message: 'Error from db'})
          else if (!notif)
            return res.json({success: false, message: 'Notification not found'})
          else
            if (req.body.param == 'is_display')
              Notification.update({
              _id:notif._id},{is_display: false}, function(err) {
                if (!err) {
                  return res.json({success: true, message: 'Notification update success'})
                }
                else
                  return res.json({success: false, message: 'Notification update Failed'})
              });
            else if (req.body.param == 'has_read')
              Notification.update({
              _id:notif._id},{has_read: true}, function(err) {
                if (!err) {
                  return res.json({success: true, message: 'Notification update success'})
                }
                else
                  return res.json({success: false, message: 'Notification update Failed'})
              });
          });
        }
      });
    });

//---------------------------------------DELETE NOTIFICATION--------------------------------------------

apiRoutes.delete('/notifications/notification', function(req, res) {
  if (!req.body.notif_id)
    return res.json({success: false, message: 'Error: request incomplete'});
  User.findOne({
    token: req.headers['x-access-token'],
  }, function (err, user) {
    if (err) return res.json({success: false, message: 'Error from db'});
    else if (!user)
      return res.json({success: false, message: 'User not found.'});
    else {
      Notification.findOne({
        _id: req.body.notif_id
      }, function (err, notif) {
        if (err) return res.json({success: false, message: 'Error from dbo'})
        else if (!notif)
          return res.json({success: false, message: 'Notification not found'})
        else if (notif.subject_id == user._id || user.roles.includes('ADMIN'))
        {
          Notification.remove({
            _id: notif._id}, function(err) {
              if (!err)
                return res.json({success: true, message: 'Notification removal success'})
              else
                return res.json({success: false, message: 'Notification removal Failed'})
            });
          }
          else
            return res.json({success: false, message: 'You must owner of the notifcation to delete it'});
        });
      }
    });
  });

}
