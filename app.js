/*
        API entry point
*/

// Packages
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose      = require('mongoose');
const MongoClient   = require('mongodb').MongoClient;
const session       = require('express-session');

// Config
const db                = require('./config/db');
const secret            = require('./config/secrets');
const welcome_messages  = require('./config/welcome_messages');

// Declare server
const app = express()

// Config server
app.use(bodyParser.json())
app.use(cors({ credentials: true, origin: true }))

const port = process.env.PORT || 8000;

const server = require('http').createServer(app)
const io = require('socket.io').listen(server)

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

app.use(bodyParser.urlencoded({ extended: true })); // used to manipulate json objects in http params/responses
app.use(morgan('combined'));  // use morgan to log requests to the console

mongoose.connect(db.url); // connect to database
app.set('superSecret', secret.secret); // secret variable
app.use(session({ secret: 'this-is-a-secret-token', cookie: { secure: false, httpOnly: false}}));

app.post('/hello', function(req, res) {
    res.json({'hi':'hi'})
});

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

const apiRoutes = express.Router();

app.use('/api', apiRoutes);
require('./routes/routes-demo')(app, apiRoutes);

// API ROUTES -------------------

// get an instance of the router for api routes
//const apiRoutes = express.Router();

require('./routes/routes-auth')(app, apiRoutes);
require('./routes/routes-users')(app, apiRoutes);
require('./routes/routes-tickets')(app, apiRoutes, io);
require('./routes/routes-residences')(app, apiRoutes);
require('./routes/routes-application')(app, apiRoutes, io);
require('./routes/routes-comments')(app, apiRoutes);
require('./routes/routes-notification')(app, apiRoutes, io);
require('./routes/routes-mailer')(app, apiRoutes);
require('./routes/routes-reporting')(app, apiRoutes);

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

//app.listen(port);
server.listen(process.env.PORT || 8000);
