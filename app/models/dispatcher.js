'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Dispatcher', new Schema({
  team_id: Schema.Types.ObjectId,
  title: String,
  date: String,
  aggregate: String,
  send: Number,
  destination: String,
  divide: [],
}));
