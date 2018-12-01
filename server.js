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

console.log(process.env.DB_URL)

// Config server
app.use(bodyParser.json())
app.use(cors({ credentials: true, origin: true }))

const port = process.env.PORT || 8000;

const server = require('http').createServer(app)
const io = require('socket.io').listen(server)

io.on('connection', function(socket){
    console.log('a user connected to the socket');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

app.use(bodyParser.urlencoded({ extended: true })); // used to manipulate json objects in http params/responses
app.use(morgan('combined'));  // use morgan to log requests to the console

mongoose.connect(db.url); // connect to database
app.set('superSecret', secret.secret); // secret variable
app.use(session({ secret: 'this-is-a-secret-token', cookie: { secure: false, httpOnly: false}}));
require('./routes/routes-public')(app);
const apiRoutes = express.Router();
app.use('/api', apiRoutes);
require('./routes/routes-demo')(app, apiRoutes, io);
require('./routes/routes-auth')(app, apiRoutes);
require('./routes/routes-users')(app, apiRoutes);
require('./routes/routes-tickets')(app, apiRoutes, io);
require('./routes/routes-residences')(app, apiRoutes);
require('./routes/routes-application')(app, apiRoutes, io);
require('./routes/routes-comments')(app, apiRoutes);
require('./routes/routes-notification')(app, apiRoutes, io);
require('./routes/routes-messagerie')(app, apiRoutes, io);
require('./routes/routes-mailer')(app, apiRoutes);
require('./routes/routes-reporting')(app, apiRoutes);
require('./routes/routes-informations')(app, apiRoutes);

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

//app.listen(port);
server.listen(process.env.PORT || 8000);

