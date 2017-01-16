'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('scores', new Schema({
  team_id: Schema.Types.ObjectId,
  gameName: String,
  venue: String,
  date: String,
  quarter: Number,
  quarterScore: String,
  teamA: String,
  teamB: String,
  runningScore: String,
  refereeData: String,
}));
