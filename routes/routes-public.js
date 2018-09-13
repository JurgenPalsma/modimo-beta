const Lead          = require('../models/lead');

module.exports = function(app) {

    apiRoutes.post('/lead', function(req, res) {
        lead = new Lead({
            name: req.name,
            email: req.mail,
            msg: req.message,
            role: req.role,
            from_demo: true
        });
        if ((lead.save()).hasWriteError) 
            return ({success: false, message: "Db not writable"})
        else
            return res.json({success: true, message: "Contact posted"})
    })

    /**
     * @api {get} /hello Ping the API
     * @apiName Hello
     * @apiGroup Public
     *
     *
     * @apiSuccess {String} hi The Pong
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "hi": "hi",
     *     }
     *
     */
    app.post('/hello', function(req, res) {
        res.json({"hi":"hi"})
    });
    
    /**
     * @api {get} /ping Ping the API
     * @apiName Ping
     * @apiGroup Public
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "pong": "pong"
     *     }
     *
     */
    app.post('/ping', function(req, res) {
        return res.json({'success': true, 'pong': 'pong'})
    });

    /*
        Route to register
    */
   app.post('/api/register', function(req, res) {

    if (req.body.name && req.body.password && req.body.email && req.body.residence_id) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(req.body.email).toLowerCase())) { return res.json({success: false, message: 'bad email'});
        }

        User.findOne({ email: req.body.email, residence: req.body.residence_id }, function(err, user) {
            if (err) throw err;
                // check if user exists
            if (user) {
                return res.json({success: false, message: 'User already exists'});
            } else {
                
                Residence.findOne({
                    _id: req.body.residence_id,
                }, function (err, residence) {
                    if (err) return res.json({success: false, message: 'Error from db'});
                    if (!residence) {
                        return res.json({success: false, message: 'Residence not found.'})
                    } else if (residence) {
                        // create user
                        let user = new User({
                            name: req.body.name,
                            password: req.body.password,
                            email: req.body.email,
                            residence: req.body.residence_id, // TODO check if res exists
                            roles: ["RESIDENT"],
                            created_at: new Date(),
                            application_list: residence.default_app_ids,
                        });
                        // save the user
                        user.save(function(err) {
                            if (err) throw err;

                            // get user's caretaker's ID first
                            User.findOne({
                                _id: residence.caretaker_id,
                            }, function (err, caretaker) {
                                if (err) return res.json({success: false, message: 'Error from db'});
                                if (!caretaker) {
                                    return res.json({success: false, message: 'Caretaker not found.'})
                                } else if (caretaker) {

                                    let conv_participants = [];
                                    conv_participants.push(user._id);
                                    conv_participants.push(caretaker._id);

                                    let messages = [];
                                    messages.push({content: welcome_messages.caretaker_welcome_FR,
                                        timestamp: Date.now(),
                                        author: caretaker._id});

                                    // Create conversation with caretaker
                                    let conversation = new Conversation({
                                        with: conv_participants,
                                        messages: messages,
                                        author: user._id
                                    });

                                    // Save conv to db
                                    conversation.save(function (err) {
                                        if (err) return res.json({success: false});
                                        // return conversation
                                        else {
                            
                                            if (mailer.sendSyncTemplatedSGEmail(to=user.email, subject='Bievenue dans la résidence 2.0', sub={name: user.name}, templateId= '43893a65-6e79-4630-acd8-be76286ae2e7'))
                                                return res.json({success: true, message: "User registered"});
                                            else
                                                return res.json({success: false, message: "Registration mail not sent"});
                                        }
                                    });

                                }
                            });
                        });
                    }
                });
            }});
    }
    else {
        res.json({ success: false, message: "Incomplete request" });
    }
    });
    
    // route to get list of residences
    app.get('/api/residences', function(req, res) {
        Residence.find({
        }, function (err, resi) {
            if (err) return res.json({success: false, message: 'Error from db'});
            if (!resi)
                res.json({success: false, message: 'No residences'});
            res.json({success: true, residences: resi});
        });
    });
};