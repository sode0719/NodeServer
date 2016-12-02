'use strict';
const express = require('express');
const apiRoutes = new express.Router();

const log = require('../../util/logger');
const fcm = require('../../util/fcm');

// MongoDB
const User = require('../../models/user');
const Dispatcher = require('../../models/dispatcher');
const Confirm = require('../../models/confirm');
const ObjectId = require('mongoose').Types.ObjectId;

apiRoutes.post('/', function(req, res) {
  const team_id = new ObjectId(req.body.team_id);

  User.find({team_id: team_id}, function(err, users) {
    if(err) {
      throw err;
    }

    const dispatcher = new Dispatcher({
      team_id: team_id,
      title: req.body.title,
      date: req.body.date,
      aggregate: req.body.aggregate,
      destination: req.body.destination,
      send: users.length,
    });

    dispatcher.save(function(err) {
      if(err) {
        throw err;
      }

      fcmSend(team_id, '「' + req.body.title + '」の配車が登録されました');

      res.json({success: true});
    });
  });
});

apiRoutes.get('/:dispatcher_id', function(req, res) {
  Dispatcher.find({_id: ObjectId(req.params.dispatcher_id)}, function(err, d) {
    if(err) {
      throw err;
    }

    res.json(d);
  });
});

apiRoutes.put('/:dispatcher_id', function(req, res) {
  Dispatcher.findOne({_id: ObjectId(req.params.dispatcher_id)}, function(err, doc) {
    doc.divide = req.body.divide,

    doc.save(function(err) {
      if(err) {
        throw err;
      }
      const data = JSON.parse(doc.divide);

      console.log('going');
      for(let i = 0; i < data.going.length; i++) {
        console.log(data.going[i].owner_id + ' ' + data.going[i].capacity);
        for(let j = 0; j < data.going[i].divide.length; j++) {
          console.log(data.going[i].divide[j].name);
        }
      }

      console.log('\nreturn');
      for(let i = 0; i < data.return.length; i++) {
        console.log(data.return[i].owner_id + ' ' + data.return[i].capacity);
        for(let j = 0; j < data.return[i].divide.length; j++) {
          console.log(data.return[i].divide[j].name);
        }
      }

      fcmSend(doc.team_id, '「' + doc.title + '」の配車が決定しました');

      res.json({success: true});
    });
  });
});

apiRoutes.delete('/:dispatcher_id', function(req, res) {
  Dispatcher.remove({_id: ObjectId(req.params.dispatcher_id)}, function(err) {
    if(err) {
      throw err;
    }
    res.json({success: true});
  });
});

apiRoutes.get('/team/:team_id', function(req, res) {
  Dispatcher.find({team_id: ObjectId(req.params.team_id)}, function(err, team) {
    if(err) {
      throw err;
    }

    res.json(team);
  });
});

apiRoutes.get('/id/:id', function(req, res) {
  Confirm.find({dispatcher_id: ObjectId(req.params.id)}, function(err, confirm) {
    if(err) {
      throw err;
    }

    res.json(confirm);
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
