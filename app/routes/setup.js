var express  = require('express');
var router   = express.Router();

var mongoose = require('mongoose');
var User     = require('../models/user');

// データベースにテストデータ作成
router.get('/', function(req, res) {
  var demo = new User({
    name: 'demouser',
    password: 'password',   // TODO: encrypt password
    admin: true
  });

  demo.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true});
  });

});

module.exports = router;
