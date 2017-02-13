'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
  id: String,
  name: String,
  password: String,
  team_id: Schema.Types.ObjectId,
  delegate: Boolean,
  fcmToken: String,
  carCapacity: Array,
}));
