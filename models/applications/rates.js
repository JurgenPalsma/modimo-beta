var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Rates', new Schema({
    stars: Number,
    comment: String,
    quote: String,
    author_id: String,
    author_name: String,
    application_id: String
}));