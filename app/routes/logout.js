'use strict';

const express = require('express');
const router  = express.Router();

router.get('/', function(req, res, next) {
  req.session.destroy();
  res.render('logout', { title: 'ログアウト', login: false});
});

router.get('/redirect', function(req, res, next) {
  req.session.destroy();

  res.render('redirect');
});

module.exports = router;
