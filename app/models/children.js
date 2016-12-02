'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Children', new Schema({
  user_id: Schema.Types.ObjectId,
  name: String,
}));
