'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Child', new Schema({
  team_id: Schema.Types.ObjectId,
  date: String,
  aggregate: String,
  destination: String,
  adult: [],
  child: [],
  divide: [],
}));
