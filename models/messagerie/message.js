var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Message', new Schema({
    from: String,
    to: String,
    content: String,
    timestamp: Number,
}));