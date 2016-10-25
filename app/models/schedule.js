'use strict';

// get mongoose.Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// make user model and export
module.exports = mongoose.model('Schedule', new Schema({
  team_id: String,
  title: String,
  start: String,
  end: String,
  allDay: Boolean,
  location: String,
  memo: String,
}));
