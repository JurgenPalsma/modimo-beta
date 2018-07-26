var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Residence', new Schema({
    name: String ,
    caretaker_id: String ,
    default_app_ids: [String]
}, { runSettersOnQuery: true }));