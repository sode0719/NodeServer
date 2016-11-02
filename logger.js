'use strict';
//  =======================
//  コンソールカラー
//  =======================
const black   = '\u001b[1;30m';
const red     = '\u001b[31m';
const green   = '\u001b[32m';
const yellow  = '\u001b[33m';
const blue    = '\u001b[34m';
const magenta = '\u001b[35m';
const cyan    = '\u001b[36m';
const white   = '\u001b[37m';

const reset   = '\u001b[0m';

const MessageType = {
  INFO: cyan + '[INFO]' + reset,
  WARNING: yellow + '[WARNING]' + reset,
  ERROR: red + '[ERROR]' + reset,
  SUCCESS: green + '[SUCCESS]' + reset,
  FAILURE: red + '[FAILURE]' + reset,
  DEVELOP: black + '[DEVELOP]' + reset,
};

function getTimestamp() {
  const d = new Date();
  let hour = '';
  if(d.getHours() < 10) {
    hour = '0' + d.getHours();
  } else {
    hour = d.getHours();
  }

  let min = '';
  if(d.getMinutes() < 10) {
    min = '0' + d.getMinutes();
  } else {
    min = d.getMinutes();
  }

  let sec = '';
  if(d.getSeconds() < 10) {
    sec = '0' + d.getSeconds();
  } else {
    sec = d.getSeconds();
  }

  const timestamp = hour + ':' + min + ':' + sec;

  return timestamp;
}

function setBracketsColor(timestamp, color) {
  // 色なし
  return '[' + black + timestamp + reset + ']';
  // 括弧に色
  // return color + '[' + reset + timestamp + color + ']' + reset;
  // 括弧と時間に色
  // return color + '[' + timestamp + ']' + reset;
}

exports.log = function(text) {
  console.log(setBracketsColor(getTimestamp(), white) + text);
};

exports.info = function(text) {
  console.log(setBracketsColor(getTimestamp(), cyan) + MessageType.INFO + text);
};

exports.warning = function(text) {
  console.log(setBracketsColor(getTimestamp(), yellow) + MessageType.WARNING + text);
};

exports.error = function(text) {
  console.log(setBracketsColor(getTimestamp(), red) + MessageType.ERROR + text);
};

exports.success = function(text) {
  console.log(setBracketsColor(getTimestamp(), green) + MessageType.SUCCESS + text);
};

exports.failure = function(text) {
  console.log(setBracketsColor(getTimestamp(), red) + MessageType.FAILURE + text);
};

exports.develop = function(text) {
  console.log(setBracketsColor(getTimestamp(), black) + MessageType.DEVELOP + text);
};
