var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Contact', new Schema({
    name: String,
    uid: String,
    of: String,
    //    uid: String,
}));