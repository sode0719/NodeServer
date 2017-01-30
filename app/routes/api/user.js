'use strict';
const express = require('express');
const apiRoutes = new express.Router();

const log = require('../../util/logger');
const fcm = require('../../util/fcm');

// MongoDB
const User = require('../../models/user');
const Children = require('../../models/children');
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

apiRoutes.get('/person/:user_id', function(req, res) {
  const person = [];
  User.find({_id: req.params.user_id}, function(err, user) {
    if(err) {
      throw err;
    }
    person.push(user[0]);
    Children.find({user_id: user[0]._id}, function(err, child) {
      if(err) {
        throw err;
      }
      person.push(child);

      res.json(person);
    });
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

apiRoutes.put('/fcm/:user_id', function(req, res) {
  User.findOne({_id: ObjectId(req.params.user_id)}, function(err, doc) {
    doc.fcmToken = req.body.fcmToken,

    doc.save(function(err) {
      if(err) {
        throw err;
      }

      fcmSend(doc._id, 'アカウントを連携しました');

      res.json({success: true});
    });
  });
});

// プッシュ通知
function fcmSend(id, body) {
  User.find({_id: id}, function(err, users) {
    if(err) {
      throw err;
    }
    users.forEach(function(user) {
      const to = user.fcmToken;
      fcm.send(to, body);
    });
  });
}

module.exports = apiRoutes;
