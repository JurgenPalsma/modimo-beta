const Application 	= require('../models/applications/application');
const Rates 		= require('../models/applications/rates');
const User 			= require('../models/user');
const Keywords 		= require('../models/applications/keywords');
const Label 		= require('../models/applications/label');
const Notification 	= require('../models/notifications/notification');
var async 			= require('async');


function notification () {

//---------------------------------------LIB FUNCTIONS FOR TICKET---------------------------------------------
//---------------------------------------CREATE TICKET--------------------------------------------------------

	this.createTicket = function(ticketName, actorId, actorName, ticketId, residenceId, io){
		if (!ticketName || !actorId || !actorName || !ticketId || !residenceId)
			return
		else
			User.find({residence: residenceId}, function(err, result) {
				var tab = [];
				for (var x in result){
					if (result[x]._id.toString() != actorId){
						var notification = new Notification({
							title: ticketName,
							has_read: false,
							actor_id: actorId,
							actor_name: actorName,
							subject_id: result[x]._id,
							link: "Ticket",
							type: "Cr",
							is_display: true,
							object: ticketId,
							created_at: new Date(),
							subject_residence: residenceId,
						});
						tab.push(notification);
						io.emit('newNotificationsTicketCreation', {id: result[x]._id});
					}
				}
				async.eachSeries(tab, function(notification, asyncdone){
					notification.save(asyncdone);
				})
				return
			})
	};

//---------------------------------------ADVANCEMENT TICKET---------------------------------------------------

	this.advancementTicket = function(ticketName, actorId, actorName, ticketId, advancementTicket, residenceId, io){
		if (!ticketName || !actorId || !actorName || !ticketId || !residenceId || !advancementTicket)
			return
		else
			User.find({residence: residenceId}, function(err, result) {
				var tab = [];
				for (var x in result){
					if (result[x]._id.toString() != actorId){
						var notification = new Notification({
							title: ticketName,
							has_read: false,
							actor_id: actorId,
							actor_name: actorName,
							subject_id: result[x]._id,
							link: "Ticket",
							type: "Ad " + advancementTicket,
							is_display: true,
							object: ticketId,
							created_at: new Date(),
							subject_residence: residenceId,
						});
						tab.push(notification);
						io.emit('newNotificationsTicketAdvancement', {id: result[x]._id});
					}
				}
				async.eachSeries(tab, function(notification, asyncdone){
					notification.save(asyncdone);
				})
				return
			})
	};

//---------------------------------------UPDATE TICKET--------------------------------------------------------

this.updateTicket = function(ticketName, actorId, actorName, ticketId, residenceId, io){
	if (!ticketName || !actorId || !actorName || !ticketId || !residenceId)
		return
	else
		User.find({residence: residenceId}, function(err, result) {
			var tab = [];
			for (var x in result){
				if (result[x]._id.toString() != actorId){
					var notification = new Notification({
						title: ticketName,
						has_read: false,
						actor_id: actorId,
						actor_name: actorName,
						subject_id: result[x]._id,
						link: "Ticket",
						type: "Mo",
						is_display: true,
						object: ticketId,
						created_at: new Date(),
						subject_residence: residenceId,
					});
					tab.push(notification);
					io.emit('newNotificationsTicketUpdate', {id: result[x]._id});
				}
			}
			async.eachSeries(tab, function(notification, asyncdone){
				notification.save(asyncdone);
			})
			return
		})
};

//---------------------------------------GET COM--------------------------------------------------------------

this.getCom = function(ticketName, actorId, actorName, ticketId, residenceId, io){
	if (!ticketName || !actorId || !actorName || !ticketId || !residenceId)
		return
	else
		User.find({residence: residenceId}, function(err, result) {
			var tab = [];
			for (var x in result){
				if (result[x]._id.toString() != actorId){
					var notification = new Notification({
						title: ticketName,
						has_read: false,
						actor_id: actorId,
						actor_name: actorName,
						subject_id: result[x]._id,
						link: "Ticket",
						type: "Co",
						is_display: true,
						object: ticketId,
						created_at: new Date(),
						subject_residence: residenceId,
					});
					tab.push(notification);
					io.emit('newNotificationsTicketCom', {id: result[x]._id});
				}
			}
			async.eachSeries(tab, function(notification, asyncdone){
				notification.save(asyncdone);
			})
			return
		})
};

//---------------------------------------GET NOTIF------------------------------------------------------------

this.getNotif = function(userId, flag, callback) {
	User.findOne({
		_id: userId,
	}, function (err, user) {
		if (err)
			callback(err, "");
		else if (!user)
			callback(err, "");
		else if (flag == "all")
			Notification.find({
				subject_id: userId
			}, function(err, notifs) {
				if (err)
					callback(err, "");
				else
					callback("", notifs);
			})
		else
			Notification.find({
				subject_id: userId,
				has_read: flag
			}, function(err, notifs) {
				if (err)
					callback(err, "");
				else
					callback("", notifs);
			})
	});
}
	return this;
};

//---------------------------------------END OF FUNCTIONS FOR TICKET--------------------------------------------------------

module.exports = new notification();
