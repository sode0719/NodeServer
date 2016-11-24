'use strict';
const express = require('express');
const apiRoutes = new express.Router();

const log = require('../../util/logger');

// MongoDB
const User = require('../../models/user');
const ObjectId = require('mongoose').Types.ObjectId;

apiRoutes.get('/:user_id', function(req, res) {
  User.find({id: req.params.user_id}, function(err, user) {
    if(err) {
      throw err;
    }

    res.json(user);
  });
});

apiRoutes.get('/check/:user_id', function(req, res) {
  User.find({id: req.params.user_id}, function(err, user) {
    if(err) {
      throw err;
    }
    if(user.length > 0) {
      res.json({find: true});
    } else {
      res.json({find: false});
    }
  });
});

apiRoutes.post('/:user_id', function(req, res) {
  const user = new User({
    id: req.params.user_id,
    name: req.body.name,
    password: req.body.password,
    team_id: Schema.Types.ObjectId,
    delegate: false,
    fcmToken: 'token',
    car: -1,
    child: [],
  });

  user.save(function(err) {
    if(err) {
      throw err;
    }

    res.json({success: true});
  });
});

apiRoutes.delete('/', function(req, res) {
});

apiRoutes.put('/', function(req, res) {
});

module.exports = apiRoutes;
