'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('confirm', new Schema({
  dispatcher_id: Schema.Types.ObjectId,
  user_id: Schema.Types.ObjectId,
  name: String,
  confirm: Boolean,
  operator: Boolean,
  status: Number,
  car: Number,
  capacity: Number,
  children: [],
}));
