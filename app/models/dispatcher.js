'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Dispatcher', new Schema({
  schedule_id: Schema.Types.ObjectId,
  team_id: Schema.Types.ObjectId,
  isUse: Boolean,
  title: String,
  date: Date,
  aggregate: String,
  send: Number,
  destination: String,
  divide: [],
}));
