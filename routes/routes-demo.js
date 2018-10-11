const Residence     = require('../models/residence');
const User          = require('../models/user');
const Ticket        = require('../models/tickets/ticket');
const Notif         = require('../functions/notifications');
const Lead          = require('../models/lead');
const ticketList    = require('../config/demo_tickets')

let create_lead = function(role, email) {
    lead = new Lead({
        email: email,
        role: role,
        from_demo: true
    });

    if ((lead.save()).hasWriteError) return ({success: false, message: "Db not writable"})
    else return({success: true});
}

module.exports = function(app, apiRoutes) {

    let create_demo_res = function(user_is_caretaker=false) {
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
            password: "super secret",
            application_list: default_app_ids,
            roles: ["CARETAKER", "ADMIN"]
        });

        let residence = new Residence({
            name: "Une résidence démo",
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
