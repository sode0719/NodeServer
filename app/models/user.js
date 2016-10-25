'use strict';

// get mongoose.Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// make user model and export
module.exports = mongoose.model('User', new Schema({
  id: String,
  name: String,
  password: String,
  team_id: String,
  delegate: Boolean,
}));
