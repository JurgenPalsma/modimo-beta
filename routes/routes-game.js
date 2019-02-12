const Residence     = require('../models/residence');
const User          = require('../models/user');
const Ticket        = require('../models/tickets/ticket');
const Comment       = require('../models/comment');
const Notif         = require('../functions/notifications');
const Lead          = require('../models/lead');
const ticketList    = require('../config/game_tickets')
const messageList   = require('../config/game_messages');
const infoList      = require('../config/game_informations');
const mailer        = require('../functions/mailer')
const Conversation  = require('../models/messagerie/conversation');
const Info          = require('../models/billboard/informations');


let create_lead = function(role, email) {
    lead = new Lead({
        email: email,
        role: role,
        from_demo: true
    });

    if ((lead.save()).hasWriteError) return ({success: false, message: "Db not writable"})
    else return({success: true});
}

module.exports = function(app, apiRoutes, io) {

    let create_game_res = function(firstname, lastname, email) {
        let residence_name = "Vilan Neuf"
        // TODO: Parametrize all this with config files
        let default_app_ids = [
            "5a774ac0734d1d3bd58cefc7", // Modistore
            "5a774052919a502dbb340f65", // Ticket
            // "5a77410f919a502dbb340f6b"  // Mur d'Affiche
            "5be84e2ebb6ba100146302a1",
            "5a773f8f919a502dbb340f60" // Messagerie
        ]
        let caretaker = new User({
            name: firstname + " " + lastname,
            password: "1234",
            application_list: default_app_ids,
            roles: ["CARETAKER", "GAME"]
        });

        let caretaker2 = new User({
            name: 'Adrien Gardioneaux',
            password: '1234',
            application_list: default_app_ids,
            roles: ["CARETAKER", "ADMIN"]
        })

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
            caretaker2.residence = residence._id;
            caretaker.email =  email
            caretaker2.email = "adrien@" + residence_name.toLowerCase() + ".fr"
            if ((caretaker2.save()).hasWriteError || (caretaker.save()).hasWriteError)
                return ({success: false, message: "Db not writable"})
            return ({success: true, residence: residence, caretaker: caretaker, caretaker2: caretaker2})
        }
    }

    let gen_resident = function(residence_id, residence_name, number) {
        nameList = ['Adrienne Giraud', 'Murielle Leprestre', 'Vivienne Lambert', 'Nolwenn Palsma','Sebastien Lejeune', 'Emilien Boll', 'Gastien Moisset', 'Vivien Craye', 'Julien Bansard', 'Lucien Carrier', 'Felicien Sander', 'Alain Viguier', 'Germain Boudib']
        let residents = []
        for (let i = 0; i < number; i++) {
            name = nameList[Math.floor(Math.random()*nameList.length)]
            let resident = new User({
                name: name,
                password: "super secret",
                residence: residence_id,
                email:  name.replace(' ', '.') + '@' + residence_name.toLowerCase() + ".fr",
                roles: ["RESIDENT"]
            });
            if ((resident.save()).hasWriteError)
                return null
            nameList = nameList.filter(n => n != name);
            residents.push(resident._id)
        }
        return (residents)
    }

    let fill_game_tickets = function(coupable, residents, res_name, res_id, caretaker_id, caretaker2_id) {
        writeError = false

        ticketList.forEach(function (dticket) {
            let closed_by = dticket.status == 'closed' ? 
                            residents[Math.floor(Math.random() * (residents.length + 1))] 
                            : ''
            let ticket = new Ticket({
                author_id: dticket.author === "coupable" ? coupable : residents[Math.floor(Math.random()*residents.length)],
                title: dticket.title,
                content: dticket.content,
                created_at: new Date(dticket.created_at.$date),
                updated_at: new Date(dticket.updated_at.$date),
                residence_id: res_id,
                status: dticket.status,
                votes: dticket.votes,
                closed_by: closed_by,
                resolution_time: Math.abs(new Date(dticket.created_at.$date) - new Date(dticket.updated_at.$date))
            });
            if ((ticket.save()).hasWriteError) {
                writeError = true
                return ({success: false, message: "Db not writable"})
            }
            Notif.createTicket(ticket.name, ticket.author_id, "Un gardien", ticket._id, ticket.residence_id, io)
            if (dticket.comments) {
                let resList = residents.filter(res => res != ticket.author_id);
                dticket.comments.forEach((comment) => {
                    let author_id = comment.author == "self" ? ticket.author_id : (comment.author === "caretaker" ? caretaker2_id : comment.author === "coupable" ? coupable : (resList[Math.floor(Math.random()*(resList.length - 1))]))
                    let newComment = new Comment({
                        content: comment.content,
                        author_id: author_id,
                        parent_id: ticket._id,
                        created_at: new Date(comment.created_at.$date),
                        updated_at: new Date(comment.updated_at.$date)
                    });
                    resList = resList.filter(res => res != author_id);
                    newComment.save(function(err, room) {
                        if (err) return({success: false, message: err.message});
                        else {
                            ticket.update({
                                $push: {comments: {_id : room._id}}}, function (err) {
                                if (err) {
                                    return({success: false, message: 'Ticket update Failed'})
                                }
                            })
                        }
                    });
                })
            }
        });
        if (!writeError) {
            //Notif.createTicket("Un premier ticket est apparu", user._id, user.name, ticket.id, ticket.residence_id);
            return({success: true});
        }
    }

    function init_messaging (coupable, residents, res_name, res_id, caretaker_id, caretaker2_id) {

        // get user's caretaker's ID first
            let writeError = false
            let resList = residents;
            messageList.forEach(messageConfig => {
                let conv_participants = [];
                let author_id = messageConfig.author === "caretaker" ? caretaker2_id : (messageConfig.author === "coupable" ? coupable : resList[Math.floor(Math.random()*(resList.length - 1))]);
                conv_participants.push(caretaker_id);
                conv_participants.push(author_id);
    
                let messages = [];
                messageConfig.messages.forEach(message => {
                    messages.push({
                        content: message.content,
                        timestamp: Date.now(),
                        author: message.self ? caretaker_id : conv_participants[1]});
                })
    
                // Create conversation with caretaker
                let conversation = new Conversation({
                    with: conv_participants,
                    messages: messages,
                    author: caretaker_id
                });
                // Save conv to db
                if ((conversation.save()).hasWriteError) {
                    writeError = true
                    return ({success: false, message: "Db not writable"})
                }
                resList = resList.filter(res => res != author_id);
            })

            if (!writeError) {
                //Notif.createTicket("Un premier ticket est apparu", user._id, user.name, ticket.id, ticket.residence_id);
                return({success: true});
            }
    }

    async function init_billboard(coupable, residents, residence, caretaker_id, caretaker2_id) {
        let writeError = false;
        let resList = residents;
        infoList.forEach(async information => {
            let author_id = (information.author === "caretaker" ? caretaker2_id : information.author === "coupable" ? coupable : (resList[Math.floor(Math.random()*(resList.length - 1))]))
            let author = await User.findOne({_id: author_id});
            let info = new Info({
                author_id: author_id,
                author_name: author.name,
                info_type: 'info',
                title: information.title,
                content: information.content,
                created_at: new Date(information.created_at.$date),
                updated_at: new Date(information.updated_at.$date),
                residence: residence._id
            });
            if (info.save().hasWriteError)
                return res.json({success: false, message: err.message});
            resList = resList.filter(res => res != author_id);
        })
        return ({success: true});
    }

    apiRoutes.post('/game', async function(req, res) {
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
            resi = create_game_res(req.body.firstname, req.body.lastname, req.body.email)
        if (resi.success == false) return res.json(resi)

        residents = gen_resident(resi.residence._id, resi.residence.name, 5);
        let coupable = new User({
            name: "Jeremy Malfoy",
            password: "super secret",
            residence: resi.residence._id,
            email:  "jeremy.malfoy" + '@' + resi.residence.name.toLowerCase() + ".fr",
            roles: ["RESIDENT"]
        });
        if ((coupable.save()).hasWriteError)
            return null
        if (residents != null) {
            let ticket_r = fill_game_tickets(coupable._id, residents, resi.residence.name, resi.residence._id, resi.caretaker._id, resi.caretaker2._id)
            if (!ticket_r.success) return res.json(ticket_r)
            let lead_r = create_lead('ADMIN', req.body.email);
            if (!lead_r.success) return res.json(lead_r)
            let messagingInitialisation = init_messaging(coupable._id, residents, resi.residence.name, resi.residence._id, resi.caretaker._id, resi.caretaker2._id);
            if (!messagingInitialisation.success) 
                return res.json(messagingInitialisation);
            let billboardInitialisation = await init_billboard(coupable._id, residents, resi.residence, resi.caretaker._id, resi.caretaker2._id);
            if (!billboardInitialisation.success)
                return res.json(billboardInitialisation);
            if (mailer.sendSyncTemplatedSGEmail(to=resi.caretaker.email, subject='Bienvenue dans la résidence 2.0!', sub={'name': resi.caretaker.name}, templateId= '84068877-9d3c-4d8b-bf5d-0ccda1894db0'))
                return res.json({success: true, message: "User registered", user: resi.caretaker})
            else
                return res.json({success: false, message: "Registration mail not sent"});
        }
        else {
            return res.json({success: false, message: "Error while generating residents"})
        }
    });
}

