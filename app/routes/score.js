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

  res.render('score-list', {
    title: 'スコアシート一覧',
    login: login,
    delegate: delegate,
    team_id: team_id,
  });
});

router.get('/:id', function(req, res, next) {
  let login = false;
  if(req.session.token) {
    login = true;
  }

  const delegate = req.session.delegate;
  const id = req.params.id;

  res.render('score', {
    title: 'スコアシート',
    login: login,
    delegate: delegate,
    id: id,
  });
});

module.exports = router;
