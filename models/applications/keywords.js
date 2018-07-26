var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Keywords', new Schema({
    name: String,
    application_id: [String]
}));