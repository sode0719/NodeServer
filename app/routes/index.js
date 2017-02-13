'use strict';

const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let login = false;
  if(req.session.token) {
    login = true;
  }

  const delegate = req.session.delegate;

  res.render('index', {
    title: 'ホーム',
    login: login,
    delegate: delegate,
  });
});

module.exports = router;
