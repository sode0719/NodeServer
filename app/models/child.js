'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Child', new Schema({
  user_id: Schema.Types.ObjectId,
  name: String,
}));
