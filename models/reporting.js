var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Reporting', new Schema({
    link: String ,
    residence: String ,
    language: String
}));