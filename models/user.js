// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    name: String,
    password: String,
    residence: String,
    appartment: String,
    token: [String],
    roles: [String],        // User roles: ROOT, ADMIN, CARETAKER, RESIDENT
    application_list: [String],
    email: {
        type: String,
        lowercase: true
    },
    spammable: Boolean,
    created_at: Date
}, { runSettersOnQuery: true }));