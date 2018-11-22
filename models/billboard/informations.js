/**
 * Created by alucard on 06/01/18.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Info', new Schema({
    author_id: String,
    author_name: String,
    title: String,
    content: String,
    created_at: Date,
    updated_at: Date,
    residence: String,
}));