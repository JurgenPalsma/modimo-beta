var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Application', new Schema({
    name: String,
    shortname: String,
    link: String,
    logo: String,
    mini_logo: String,
    author_name: String,
    keywords: [String],
    created_at: Date,
    rate_average: Number,
    rate_count: Number,
    updated_at: Date,
    small_description: String,
    description: String,
    version: String,
    label_name: [String]
}));