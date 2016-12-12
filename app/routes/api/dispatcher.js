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
const ISODate = require('mongoose').Types.ISODate;

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
      let date = req.body.date.split('-');
      date = date[0] + '年' + date[1] + '月' + date[2] + '日';
      fcmSend(team_id, '「' + date + ' ' + req.body.title + '」の配車が登録されました');

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

      /*
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
      */

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
  const d = req.query.date.split('-');
  const date = new Date(d[0], Number(d[1] - 1), d[2]);
  Dispatcher.find({
    team_id: ObjectId(req.params.team_id),
    date: {$gt: date.toISOString()},
  }, function(err, team) {
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

apiRoutes.post('/confirm', function(req, res) {
  const confirm = new Confirm(JSON.parse(req.body.confirm));

  Confirm.findOne({
    dispatcher_id: ObjectId(confirm.dispatcher_id),
    user_id: ObjectId(confirm.user_id),
  }, function(err, c) {
    if(err) {
      throw err;
    }
    // 新規
    if(c.length === 0) {
      confirm.save(function(err) {
        if(err) {
          throw err;
        }
      });
    } else {
      console.log(confirm.confirm);
      c.confirm = confirm.confirm;
      c.operator = confirm.operator;
      c.status = confirm.status;
      c.car = confirm.car;
      c.capacity = confirm.capacity;
      c.children = confirm.children;

      c.save(function(err) {
        if(err) {
          throw err;
        }
      });
    }

    res.json({success: true});
  });
});

apiRoutes.get('/user/:id', function(req, res) {
  Confirm.find({
    dispatcher_id: ObjectId(req.query.dispatcher_id),
    user_id: ObjectId(req.params.id),
  }, function(err, confirm) {
    if(err) {
      throw err;
    }
    res.json(confirm);
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
