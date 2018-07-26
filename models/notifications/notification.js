var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Notification', new Schema({
    title: String,
    has_read: String,
    actor_id: String,
    actor_name: String,
    subject_id: String,
    link: String,
    type: String,
    is_display: String,
    object: String,
    created_at: Date,
    subject_residence: String
}));
