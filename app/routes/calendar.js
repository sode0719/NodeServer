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

  res.render('calendar', {
    title: 'カレンダー',
    login: login,
    delegate: delegate,
    team_id: team_id,
  });
});

module.exports = router;
