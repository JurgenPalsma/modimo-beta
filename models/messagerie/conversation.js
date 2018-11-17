var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Conversation', new Schema({
    with: [String],
    author: String,
    messages: [
        {
            author: String,
            content: String,
            timestamp: Number,
        }
    ]
}));