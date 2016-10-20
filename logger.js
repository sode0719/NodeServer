// =======================
// コンソールカラー
// =======================
var black   = "\u001b[1;30m";
var red     = "\u001b[1;31m";
var green   = "\u001b[1;32m";
var yellow  = "\u001b[1;33m";
var blue    = "\u001b[1;34m";
var magenta = "\u001b[1;35m";
var cyan    = "\u001b[1;36m";
var white   = "\u001b[1;37m";

var reset   = "\u001b[0m";

var MessageType = {
 INFO: cyan + "[INFO]" + reset,
 WARNING: yellow + "[WARNING]" + reset,
 ERROR: red + "[ERROR]" + reset,
 SUCCESS: green + "[SUCCESS]" + reset,
 FAILURE: red + "[FAILURE]" + reset,
 DEVELOP: black + "[DEVELOP]" + reset,
};

function getTimestamp() {
  var d = new Date();
  var hour  = (d.getHours()   < 10) ? "0" + d.getHours()   : d.getHours();
  var min   = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
  var sec   = (d.getSeconds() < 10) ? "0" + d.getSeconds() : d.getSeconds();

  var timestamp = hour + ":" + min + ":" + sec;

  return timestamp;
}

function setBracketsColor(timestamp, color) {
  //色なし
  return "[" + black + timestamp + reset +"]";
  //括弧に色
  //return color + "[" + reset + timestamp + color + "]" + reset;
  //括弧と時間に色
  //return color + "[" + timestamp + "]" + reset;
}

exports.log = function (text) {
  console.log(setBracketsColor(getTimestamp(), white) + text);
}

exports.info = function (text) {
  console.log(setBracketsColor(getTimestamp(), cyan) + MessageType.INFO + text);
}

exports.warning = function (text) {
  console.log(setBracketsColor(getTimestamp(), yellow) + MessageType.WARNING + text);
}

exports.error = function (text) {
  console.log(setBracketsColor(getTimestamp(), red) + MessageType.ERROR + text);
}

exports.success = function (text) {
  console.log(setBracketsColor(getTimestamp(), green) + MessageType.SUCCESS + text + ":" + green + "Success" + reset);
}

exports.failure = function (text) {
  console.log(setBracketsColor(getTimestamp(), red) + MessageType.FAILURE + text + ":" + red + "Failure" + reset);
}

exports.develop = function (text) {
  console.log(setBracketsColor(getTimestamp(), black) + MessageType.DEVELOP + text);
}
