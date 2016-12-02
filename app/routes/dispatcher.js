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

  res.render('dispatcher-list', {
    title: '配車',
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

  res.render('dispatcher', {
    title: '配車決定',
    login: login,
    delegate: delegate,
    id: id,
  });
});

module.exports = router;
