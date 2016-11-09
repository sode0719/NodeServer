'use strict';

const FCM = require('fcm-node');
const fmcKey = require('./fcm-server-key');

const fcm = new FCM(fmcKey.serverKey);

exports.fcmSend = function(to, title, body) {
  const message = {
    to: to,
    notification: {
      'title': title,
      'body': body,
      'sound': 'default',
    },
  };

  fcm.send(message, function(err, response) {
    if(err) {
      return false;
    } else {
      return true;
    }
  });
};
