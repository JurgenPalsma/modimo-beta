const User = require('../models/user');
const Ticket = require('../models/tickets/ticket');
const Reporting = require('../models/reporting');

module.exports = function(app, apiRoutes) {
    
    function convertMS( milliseconds ) {
        var day, hour, minute, seconds;
        seconds = Math.floor(milliseconds / 1000);
        minute = Math.floor(seconds / 60);
        seconds = seconds % 60;
        hour = Math.floor(minute / 60);
        minute = minute % 60;
        day = Math.floor(hour / 24);
        hour = hour % 24;
        return {
            day: day,
            hour: hour,
            minute: minute,
            seconds: seconds
        };
    }

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



    apiRoutes.get('/reporting/stats', function(req, res) {
        User.findOne({token: req.headers['x-access-token']
        }, function (err, user) {
          if (err) return res.json({success: false, message: 'Error from db'});
          else if (!user) return res.json({success: false, message: 'User not found.'});
          else if (!user.roles.includes("ROOT") && !user.roles.includes("ADMIN") && !user.roles.includes("CARETAKER")) return res.json({success: false, message: 'Access denied'});
          else {
              let daterange = ""
                if (req.headers.from == '' && req.headers.to == '') {
                    daterange = {$gte:new Date("2016-07-03T14:05:18.902Z"),$lte:new Date()}
                } 
                else daterange = {$gte:new Date(req.headers.from),$lte:new Date(req.headers.to)}
                Ticket.find(
                    {residence_id: user.residence,
                    "created_at":daterange}
                ).lean().exec(function(err, tickets) { // TODO sort here by period
                    if (err) return res.json({success: false, message: 'Error from db' + err});
                    else {
                        if (tickets.length == 0)
                            return res.json({success: false, message: 'No tickets found for this period'});
                        // Returned stats about tickets
                        let tickets_numbers = {
                            tickets_pending: 0,
                            tickets_open: 0,
                            tickets_closed: 0,
                            tickets_created_per_day: [],
                            avg_resolution_time: 0,
                            shortest_ticket: null,
                            longest_ticket: null
                        }
    
                        // Returned stats about caretakers
                        let caretaker_numbers = {
                            tickets: [{
                                _id: "",
                                name: "",
                                tickets_closed: 0
                            }]
                        }
                        
    
                        function ct_exists(arr, val) { // Opti
                            return arr.some(function(arrVal) {
                                if  (val === arrVal._id)
                                    arrVal.tickets_closed += 1;
                                return val == arrVal._id
                              });
                        }
                        
                        function tc_date_exists(arr, val) { // Opti
                            return arr.some(function(arrVal) {
                                if  (val === arrVal.date)
                                    arrVal.amount += 1;
                                return val == arrVal.date
                              });
                        }
    
    
                        resolution_times = []
                        
                        tickets.map(function(ticket) {
                            if (ticket.status === "closed") {
                                tickets_numbers.shortest_ticket = ticket
                                tickets_numbers.longest_ticket = ticket
                            }
                        })
                        // ---  Parse tickets 
                        tickets.map(function(ticket) {
                            if (ticket.status === "closed") { // if ticket is closed
                                tickets_numbers.tickets_closed += 1 // ++ number of closed tickets
                                
                                // completion time 
                                resolution_times.push(ticket.resolution_time) // add ticket time to avg
                                if (tickets_numbers.shortest_ticket.resolution_time > ticket.resolution_time) 
                                    tickets_numbers.shortest_ticket = ticket
                                else if (tickets_numbers.longest_ticket.resolution_time < ticket.resolution_time) 
                                    tickets_numbers.longest_ticket = ticket
                                
                                // Add ticket to caretaker's number of tickets closed
                                if (!ct_exists(caretaker_numbers.tickets, ticket.closed_by))
                                    caretaker_numbers.tickets.push({_id: ticket.closed_by, tickets_closed:1})     
                            }
                            else if (ticket.status === "open") // if ticket is open
                                tickets_numbers.tickets_open +=  1
                            else  // if ticket is not seen by caretaker
                                tickets_numbers.tickets_pending +=  1
                                '2017-05-13'
                            t_date = new Date(ticket.created_at);
                            t_date_f = t_date.getFullYear() + '-' + t_date.getMonth() + '-' + t_date.getDate();
                            if (!tc_date_exists(tickets_numbers.tickets_created_per_day, t_date_f))
                                tickets_numbers.tickets_created_per_day.push({date: t_date_f, amount:1})
                        })
                        
                        let timesum = 0;
                        for (let i = 0; i < resolution_times.length; i++) {
                            timesum += resolution_times[i].getTime()
                        }
                        tickets_numbers.avg_resolution_time = convertMS(timesum / resolution_times.length)
                        
                        return res.json({success: true,
                            ticket_numbers : tickets_numbers,
                            caretaker_numbers : caretaker_numbers,
                            ticketlist : tickets});  
                        
                    }
                });
            }
        });
    });
}
        