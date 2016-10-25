'use strict';

const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.destroy();
  res.render('logout', { title: 'ログアウト', login: false});
});

module.exports = router;
