'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Schedule', new Schema({
  team_id: Schema.Types.ObjectId,
  title: String,
  start: String,
  end: String,
  allDay: Boolean,
  location: String,
  memo: String,
  dispatcher: Boolean,
  aggregate: String,
}));
