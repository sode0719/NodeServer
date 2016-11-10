'use strict';

const FCM = require('fcm-node');
const fmcKey = require('./fcm-server-key');

const fcm = new FCM(fmcKey.key);

exports.send = function(to, body) {
  const message = {
    to: to,
    notification: {
      'body': body,
      'sound': 'default',
    },
  };

  fcm.send(message, function(err, response) {
    if(err) {
      console.log(err);
    }
  });
};
