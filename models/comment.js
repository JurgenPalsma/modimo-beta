var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Comment', new Schema({
    parent_id: String,
    author_id: String,
    content: String,
    created_at: Date,
    updated_at: Date
}));