'use strict';
const express = require('express');
const apiRoutes = new express.Router();

const log = require('../../util/logger');
const fcm = require('../../util/fcm');

// MongoDB
const User = require('../../models/user');
const Score = require('../../models/score');
const ObjectId = require('mongoose').Types.ObjectId;

apiRoutes.get('/:score_id', function(req, res) {
  Score.find({_id: ObjectId(req.params.score_id)}, function(err, s) {
    if(err) {
      throw err;
    }

    res.json(s);
  });
});

apiRoutes.get('/team/:team_id', function(req, res) {
  Score.find({team_id: ObjectId(req.params.team_id)}, function(err, score) {
    if(err) {
      throw err;
    }

    res.json(score);
  });
});

apiRoutes.post('/', function(req, res) {
  const score = new Score({
    team_id: req.body.team_id,
    gameName: req.body.gameName,
    venue: req.body.venue,
    date: req.body.date,
    quarter: req.body.quarter,
    quarterScore: req.body.quarterScore,
    teamA: req.body.teamA,
    teamB: req.body.teamB,
    runningScore: req.body.runningScore,
    refereeData: req.body.refereeData,
    undoList: req.body.undoList,
  });

  score.save(function(err) {
    if(err) {
      throw err;
    }

    fcmSend(score.team_id, '「' + score.gameName + '」のスコアシートが登録されました');

    res.json({success: true});
  });
});

apiRoutes.delete('/:score_id', function(req, res) {
  Score.remove({_id: ObjectId(req.params.score_id)}, function(err) {
    if(err) {
      throw err;
    }
    res.json({success: true});
  });
});

apiRoutes.put('/', function(req, res) {
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
