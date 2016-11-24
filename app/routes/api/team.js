'use strict';
const express = require('express');
const apiRoutes = new express.Router();

const log = require('../../util/logger');

// MongoDB
const Team = require('../../models/team');
const ObjectId = require('mongoose').Types.ObjectId;

apiRoutes.get('/all', function(req, res) {
  Team.find(function(err, team) {
    if(err) {
      throw err;
    }

    res.json(team);
  });
});

apiRoutes.get('/:team_id', function(req, res) {
  Team.find({_id: ObjectId(req.params.team_id)}, function(err, team) {
    if(err) {
      throw err;
    }

    res.json(team);
  });
});

apiRoutes.post('/:user_id', function(req, res) {
});

apiRoutes.delete('/', function(req, res) {
});

apiRoutes.put('/', function(req, res) {
});

module.exports = apiRoutes;
