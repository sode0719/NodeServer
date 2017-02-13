'use strict';
const express = require('express');
const apiRoutes = new express.Router();

const log = require('../../util/logger');
const fcm = require('../../util/fcm');

// MongoDB
const User = require('../../models/user');
const Schedule = require('../../models/schedule');
const Dispatcher = require('../../models/dispatcher');
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
    _id: new ObjectId(),
    team_id: team_id,
    title: req.body.title,
    start: req.body.start + ' T09:00:00+0900',
    end: req.body.end + ' T09:00:00+0900',
    allDay: false,
    location: req.body.location,
    memo: req.body.memo,
    dispatcher: req.body.dispatcher,
    aggregate: req.body.aggregate,
    isUse: true,
  });

  schedule.save(function(err) {
    if(err) {
      throw err;
    }

    let msg = '';
    const schedule_id = ObjectId(schedule._id);
    if(schedule.dispatcher) {
      const start = req.body.start;
      const end = req.body.end;

      const date = new Date(start);
      let yyyymmdd = '';
      for(let i = 0; i < getDiff(start, end); i++) {
        date.setDate(date.getDate() + i);
        const y = date.getFullYear();
        const m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        const d = date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate();
        yyyymmdd = y + '-' + m + '-' + d;
        console.log(yyyymmdd);

        resistDispatcher(team_id, req.body.title, yyyymmdd, req.body.location, schedule_id, req.body.aggregate, true);
      }

      msg = 'がスケジュールに登録されました。配車希望の返信をしてください。';
    } else {
      const dispatcher = new Dispatcher({
        schedule_id: schedule_id,
        team_id: team_id,
        isUse: false,
      });

      dispatcher.save(function(err) {
        if(err) {
          throw err;
        }
      });

      msg = 'がスケジュールに登録されました。';
    }

    fcmSend(team_id, '「' + req.body.title + '」' + msg);

    res.json({success: true});
  });
});

apiRoutes.delete('/', function(req, res) {
  Schedule.remove({_id: req.body._id}, function(err) {
    if(err) {
      throw err;
    }

    Dispatcher.remove({schedule_id: req.body._id}, function(err) {
      if(err) {
        throw err;
      }

      res.json({success: true});
    });
  });
});

apiRoutes.put('/', function(req, res) {
  const team_id = new ObjectId(req.body.team_id);
  let isDispatcher = false;

  Schedule.findOne({_id: req.body._id}, function(err, doc) {
    const schedule_id = ObjectId(doc._id);
    if(!doc.dispatcher && req.body.dispatcher) {
      isDispatcher = true;
    }

    doc.team_id = team_id;
    doc.title = req.body.title;
    doc.start = req.body.start + ' T09:00:00+0900';
    doc.end = req.body.end + ' T09:00:00+0900';
    doc.location = req.body.location;
    doc.memo = req.body.memo;
    doc.dispatcher = req.body.dispatcher;
    doc.aggregate = req.body.aggregate;
    doc.save(function(err) {
      if(err) {
        throw err;
      }

      let msg = 'のスケジュールが更新されました。配車希望の返信をしてください。';
      const start = req.body.start;
      const end = req.body.end;

      const date = new Date(start);
      let yyyymmdd = '';
      for(let i = 0; i < getDiff(start, end); i++) {
        date.setDate(date.getDate() + i);
        const y = date.getFullYear();
        const m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth();
        const d = date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate();
        yyyymmdd = y + '/' + m + '/' + d;

        if(isDispatcher) {
          resistDispatcher(team_id, req.body.title, yyyymmdd, req.body.location, schedule_id, req.body.aggregate, true);
        } else {
          resistDispatcher(team_id, req.body.title, yyyymmdd, req.body.location, schedule_id, req.body.aggregate, false);
          msg = 'のスケジュールが更新されました。';
        }
      }

      Dispatcher.findOne({schedule_id: schedule_id}, function(err, doc) {
        doc.isUse = req.body.dispatcher;

        doc.save(function(err) {
          if(err) {
            throw err;
          }
        });
      });

      fcmSend(team_id, '「' + req.body.title + '」' + msg);

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

function getDiff(start, end) {
  const s = new Date(start);
  const e = new Date(end);

  // getTimeメソッドで経過ミリ秒を取得し、２つの日付の差を求める
  const msDiff = e.getTime() - s.getTime();

  // 求めた差分（ミリ秒）を日付へ変換します（経過ミリ秒÷(1000ミリ秒×60秒×60分×24時間)。端数切り捨て）
  const daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24)) + 1;

  // 差分へ1日分加算して返却します
  return daysDiff;
}

function resistDispatcher(team_id, title, date, destination, schedule_id, aggregate, isUse) {
  User.find({team_id: team_id}, function(err, users) {
    if(err) {
      throw err;
    }
    Dispatcher.findOne({schedule_id: schedule_id}, function(err, doc) {
      if(doc === null) {
        const dispatcher = new Dispatcher({
          schedule_id: ObjectId(schedule_id),
          team_id: ObjectId(team_id),
          title: title,
          date: date,
          aggregate: aggregate,
          destination: destination,
          send: users.length,
          isUse: isUse,
        });

        dispatcher.save(function(err) {
          if(err) {
            throw err;
          }
        });
      } else {
        doc.schedule_id = schedule_id;
        doc.team_id = team_id;
        doc.title = title;
        doc.date = date;
        doc.aggregate = aggregate;
        doc.destination = destination;
        doc.send = users.length;

        doc.save(function(err) {
          if(err) {
            throw err;
          }
        });
      }
    });
  });
}
