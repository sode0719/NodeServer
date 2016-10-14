var express  = require("express");
var router   = express.Router();

var mongoose = require("mongoose");
var User     = require("../models/user");
var Schedule = require("../models/schedule");

// データベースにテストデータ作成
router.get("/", function(req, res) {
  var demo = new User({
    id: "user",
    name: "テストユーザー",
    password: "userpass",
    team_id: "null",
    delegate: true
  });

  demo.save(function(err) {
    if (err) throw err;

    console.log("User saved successfully");
    res.json({ success: true});
  });

});

module.exports = router;
