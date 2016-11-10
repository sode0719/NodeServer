'use strict';
const express = require('express');
const apiRoutes = new express.Router();

const log = require('../../util/logger');
const fcm = require('../../util/fcm');

// MongoDB
const User = require('../../models/user');
const Schedule = require('../../models/schedule');
const ObjectId = require('mongoose').Types.ObjectId;

apiRoutes.get('/:team_id', function(req, res) {
  const team_id = req.params.team_id;
  const start = req.query.start + ' T09:00:00+0900';
  const end = req.query.end + ' T09:00:00+0900';

  Schedule.find({
    team_id: new ObjectId(team_id),
    start: {
      $gte: start,
      $lt: end,
    },
  }, function(err, schedules) {
    if(err) {
      throw err;
    }
    res.json(schedules);
  });
});

apiRoutes.post('/:team_id', function(req, res) {
  const team_id = new ObjectId(req.params.team_id);
  const schedule = new Schedule({
    team_id: team_id,
    title: req.body.title,
    start: req.body.start + ' T09:00:00+0900',
    end: req.body.end + ' T09:00:00+0900',
    allDay: false,
    location: req.body.location,
    memo: req.body.memo,
  });

  schedule.save(function(err) {
    if(err) {
      throw err;
    }

    fcmSend(team_id, '「' + req.body.title + '」がスケジュールに登録されました');

    res.json({success: true});
  });
});

apiRoutes.delete('/', function(req, res) {
  Schedule.remove({_id: req.body._id}, function(err) {
    if(err) {
      throw err;
    }
    res.json({success: true});
  });
});

apiRoutes.put('/', function(req, res) {
  const team_id = new ObjectId(req.body.team_id);
  Schedule.findOne({_id: req.body._id}, function(err, doc) {
    doc.team_id = team_id;
    doc.title = req.body.title;
    doc.start = req.body.start + ' T09:00:00+0900';
    doc.end = req.body.end + ' T09:00:00+0900';
    doc.location = req.body.location;
    doc.memo = req.body.memo;
    doc.save(function(err) {
      if(err) {
        throw err;
      }

      fcmSend(team_id, '「' + req.body.title + '」のスケジュールが更新されました');

      res.json({success: true});
    });
  });
});

// プッシュ通知
function fcmSend(team_id, body) {
  User.find({team_id: team_id}, function(err, users) {
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
