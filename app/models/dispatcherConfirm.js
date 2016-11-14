'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Child', new Schema({
  dispatcher_id: Schema.Types.ObjectId,
  user_id: [],
  child: [],
}));
