var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ticketStatus = require('./ticketStatus')

module.exports = mongoose.model('Ticket', new Schema({
    author_id: String,
    title: String,
    content: String,
    votes: Array,
    comments: Array,
    created_at: Date,
    updated_at: Date,
    status: {
        type: String,
        enum: Object.values(ticketStatus),
    },
    residence_id: String,
}));