'use strict';

const express  = require('express');
const router   = express.Router();

const mongoose = require('mongoose');
const User     = require('../models/user');
const Schedule = require('../models/schedule');

// データベースにテストデータ作成
router.get('/', function(req, res) {
  const demo = new User({
    id: 'user',
    name: 'テストユーザー',
    password: 'userpass',
    team_id: 'null',
    delegate: true,
  });

  demo.save(function(err) {
    if(err) {
      throw err;
    }

    console.log('User saved successfully');

    res.json({ success: true});
  });

});

module.exports = router;
