'use strict';
const express = require('express');
const apiRoutes = new express.Router();
// MongoDB
const Schedule   = require('../../models/schedule');
const ObjectId    = require('mongoose').Types.ObjectId;

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
  const team_id = req.params.team_id;
  const schedule = new Schedule({
    team_id: new ObjectId(team_id),
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
  Schedule.findOne({_id: req.body._id}, function(err, doc) {
    doc.team_id = new ObjectId(req.body.team_id);
    doc.title = req.body.title;
    doc.start = req.body.start + ' T09:00:00+0900';
    doc.end = req.body.end + ' T09:00:00+0900';
    doc.save(function(err) {
      if(err) {
        throw err;
      }
      res.json({success: true});
    });
  });
});

module.exports = apiRoutes;
