var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Lead', new Schema({
    name: String,
    email: {
        type: String,
        lowercase: true
    },
    role: String, // "RESIDENT", "GERANT", "OTHER",
    msg: String,
    from_demo: Boolean
}, { runSettersOnQuery: true }));