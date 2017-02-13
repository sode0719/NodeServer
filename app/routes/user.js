'use strict';

const express = require('express');
const router  = express.Router();

router.get('/', function(req, res, next) {
  let login = false;
  if(req.session.token) {
    login = true;
  }
  const delegate = req.session.delegate;
  const team_id = req.session.team_id;
  const id = req.session.user_id;

  res.render('user', {
    title: 'ユーザー',
    login: login,
    delegate: delegate,
    team_id: team_id,
    id: id,
  });
});

module.exports = router;
