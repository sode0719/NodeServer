'use strict';
const express = require('express');
const apiRoutes = new express.Router();

const log = require('../../util/logger');

// MongoDB
const Team = require('../../models/team');
const User = require('../../models/user');
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

apiRoutes.put('/:team_id', function(req, res) {
  Team.findOne({_id: ObjectId(req.params.team_id)}, function(err, team) {
    if(err) {
      throw err;
    }

    team.name = req.body.name;
    team.home = JSON.parse(req.body.home);

    team.save(function(err) {
      if(err) {
        throw err;
      }

      User.find({team_id: req.params.team_id}, function(err, users) {
        if(err) {
          throw err;
        }

        const newUsers = JSON.parse(req.body.users);
        for(let i = 0; i < users.length; i++) {
          for(let j = 0; j < newUsers.length; j++) {
            if(users[i]._id == newUsers[j]._id) {
              if(users[i].delegate !== newUsers[j].delegate) {
                users[i].delegate = newUsers[j].delegate;
                users[i].save();
              }
            }
          }
        }

        res.json({success: true});
      });
    });
  });
});

apiRoutes.get('/basketnumber/:team_num', function(req, res) {
  Team.find({basketNumber: req.params.team_num}, function(err, team) {
    if(err) {
      throw err;
    }

    res.json(team);
  });
});

apiRoutes.get('/user/:team_id', function(req, res) {
  User.find({team_id: req.params.team_id}, function(err, users) {
    if(err) {
      throw err;
    }

    res.json(users);
  });
});


apiRoutes.delete('/', function(req, res) {
});

apiRoutes.put('/', function(req, res) {
});

module.exports = apiRoutes;
