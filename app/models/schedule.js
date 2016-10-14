// get mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// make user model and export
module.exports = mongoose.model('Schedule', new Schema({
  team_id: String,
  title: String,
  start: String,
  end: String
}));
