const Residence     = require('../models/residence');
const User          = require('../models/user');
const Ticket        = require('../models/tickets/ticket');
const Notif         = require('../functions/notifications');
const Lead          = require('../models/lead');
const ticketList    = require('../config/demo_tickets')
const mailer        = require('../functions/mailer')

let create_lead = function(role, email) {
    lead = new Lead({
        email: email,
        role: role,
        from_demo: true
    });

    if ((lead.save()).hasWriteError) return ({success: false, message: "Db not writable"})
    else return({success: true});
}

const welcome_messages  = require('../config/welcome_messages');
let init_messaging = function (user, resi) {
    // get user's caretaker's ID first
    User.findOne({
        _id: resi.caretaker_id,
    }, function (err, caretaker) {
        if (err) return res.json({success: false, message: 'Error from db'});
        if (!caretaker) {
            return res.json({success: false, message: 'Caretaker' + resi.caretaker_id + 'not found.'})
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
                if (err) return res.json({success: false, err: err}); 
            });
        }
    });
}

module.exports = function(app, apiRoutes) {

    let create_demo_res = function(residence_name="Une résidence démo", user_is_caretaker=false) {
        // TODO: Parametrize all this with config files
        let default_app_ids = [
            "5a774ac0734d1d3bd58cefc7",
            "5a773f8f919a502dbb340f60",
            "5a774052919a502dbb340f65",
            "5a77410f919a502dbb340f6b"
        ]
        let c_name = user_is_caretaker ? "Vous" : "Adrien le gardien"

        let caretaker = new User({
            name: c_name,
            password: "super secret password",
            application_list: default_app_ids,
            roles: ["CARETAKER", "ADMIN"]
        });

        let residence = new Residence({
            name: residence_name,
            caretaker_id: caretaker._id
        });

        default_app_ids.forEach(element => {
            residence.default_app_ids.push(element);
        });

        if ((residence.save()).hasWriteError)
            return ({success: false, message: "Db not writable"})
        else {
            caretaker.residence = residence._id;
            caretaker.email =  "demo" + residence._id + "@modimo.fr"
            if ((caretaker.save()).hasWriteError)
                return ({success: false, message: "Db not writable"})
            return ({success: true, residence: residence, caretaker: caretaker})
        }
    }

    let gen_caretaker = function(residence_id) {
        c_names = ['Jean', 'Adrienne', 'Murielle', 'François', 'Thibaut']
        c_name = c_names[Math.floor(Math.random()*c_names.length)]
        let caretaker = new User({
            name: c_name,
            password: "super secret",
            residence: residence_id,
            email:  c_name + residence_id + "@modimo.fr",
            roles: ["CARETAKER", "ADMIN"]
        });
        if ((caretaker.save()).hasWriteError)
            return null
        return (caretaker)
    }

    let fill_demo_tickets = function(user, res_id, caretaker_id) {
        writeError = false

        caretakers = [caretaker_id]
        for (let i = 0; i < 3; i++) {
            c = gen_caretaker(res_id)
            caretakers.push(c._id)
        }

        ticketList.forEach(function (dticket) {
            let ticket = new Ticket({
                author_id: caretakers[Math.floor(Math.random()*caretakers.length)],
                title: dticket.title,
                content: dticket.content,
                created_at: new Date(dticket.created_at.$date),
                updated_at: new Date(dticket.updated_at.$date),
                residence_id: res_id,
                status: dticket.status
            });
            if ((ticket.save()).hasWriteError) {
                writeError = true
                return ({success: false, message: "Db not writable"})
            }
        });
    
        if (!writeError) {
            //Notif.createTicket("Un premier ticket est apparu", user._id, user.name, ticket.id, ticket.residence_id);
            return({success: true});
        }
    }

    

    apiRoutes.post('/demo', function(req, res) {
        
        // Check email
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(req.body.email).toLowerCase())) { return res.json({success: false, message: 'bad email'});}

        // Check params
        if (!req.body.email ||
            !req.body.residenceName  ||
            !req.body.firstname ||
            !req.body.lastname ||
            !req.body.password ||
            !req.body.roles  )
            return res.json({success:false, message:'Bad params, need: (req.body.email && req.body.residenceName && req.body.firstname && req.body.lastname && req.body.password && req.body.roles)'})

        // Create demo residence
        resi = create_demo_res(name=req.body.residenceName)
        if (resi.success == false) return res.json(resi)
        
        // create user
        let user = new User({
            name: (req.body.firstname + ' ' + req.body.lastname),
            first_name : req.body.firstname,
            last_name : req.body.lastname,
            password: req.body.password,
            email: req.body.email,
            residence: resi.residence._id, // TODO check if res exists
            roles: req.body.roles,
            application_list: resi.residence.default_app_ids,
        });

        // save the user
        user.save(function(err) {
            if (err) throw err;
            else {
                let ticket_r = fill_demo_tickets(user, resi.residence._id, resi.caretaker._id)
                if (!ticket_r.success) return res.json(ticket_r)
                 
                let lead_r = req.body.roles == ['RESIDENT'] ? create_lead('RESIDENT', req.body.email) : create_lead('ADMIN', req.body.email);
                if (req.body.roles == ['RESIDENT']) {
                    messagingInitialisation = init_messaging(user, resi);
                    if (!messagingInitialisation.success) 
                        return res.json(messagingInitialisation);
                } 
                if (!lead_r.success) return res.json(lead_r)
                if (mailer.sendSyncTemplatedSGEmail(to=user.email, subject='Bienvenue dans la résidence 2.0!', sub={'name': user.name}, templateId= '84068877-9d3c-4d8b-bf5d-0ccda1894db0'))
                    return res.json({success: true, message: "User registered", user: user})
                else
                    return res.json({success: false, message: "Registration mail not sent"});
            }
        });
    });



    apiRoutes.post('/demo/resident', function(req, res) {
        
        // Check email
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(req.body.email).toLowerCase())) { return res.json({success: false, message: 'bad email'});}
        
        // Create demo residence
        resi = create_demo_res()
        if (resi.success == false) return res.json(resi)
        
        // create user
        let user = new User({
            name: "Vous",
            password: resi.residence._id,
            email: "test"+ resi.residence._id + "@test.com",
            residence: resi.residence._id, // TODO check if res exists
            roles: ["RESIDENT"],
            application_list: resi.residence.default_app_ids,
        });

        // save the user
        user.save(function(err) {
            if (err) throw err;
            else {
                let ticket_r = fill_demo_tickets(user, resi.residence._id, resi.caretaker._id)
                if (!ticket_r.success) return res.json(ticket_r)
                
                let lead_r = create_lead('RESIDENT', req.body.email)
                if (!lead_r.success) return res.json(lead_r)

                return res.json({success: true, message: "User registered", user: user})
            }
        });
    });


    /*                              Create a demo for an admin                           */
    
    apiRoutes.post('/demo/admin', function(req, res) {
        // Check email
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(req.body.email).toLowerCase())) { return res.json({success: false, message: 'bad email'});}
          
        // Create demo residence
        resi = create_demo_res(true)
        if (!resi.success) return res.json(resi)

        let ticket_r = fill_demo_tickets(resi.caretaker, resi.residence._id, resi.caretaker._id)
        if (!ticket_r.success) return res.json(ticket_r)
        
        let lead_r = create_lead('ADMIN', req.body.email)
        if (!lead_r.success) return res.json(lead_r)

        return res.json({success: true, message: "User registered", user: resi.caretaker})    
    });
}

