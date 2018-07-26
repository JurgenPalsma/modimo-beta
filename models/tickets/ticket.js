var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Ticket', new Schema({
    author_id: String,
    title: String,
    description: String,
    upvote: Array,
    downvote: Array,
    created_at: Date,
    updated_at: Date,
    residence_id: String,
    advancement: String,
}));