'use strict';

const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let login = false;
  if(req.session.token) {
    login = true;
  }

  res.render('register', {title: '新規登録'});
});

router.get('/team', function(req, res, next) {
  let login = false;
  if(req.session.token) {
    login = true;
  }

  res.render('register-team', {title: 'チーム新規登録'});
});

module.exports = router;
