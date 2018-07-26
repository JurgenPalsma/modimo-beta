var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Comment', new Schema({
    content: String,
    author_id: String,
    parent_id: String,
    parent_name: String,
    author_name: String,
    created_at: Date,
    updated_at: Date
}));