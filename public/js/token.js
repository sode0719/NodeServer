"use strict";

$(function () {
  $("#post").on('click', function () {
    login($("#id").val(), $("#password").val());
  });
});

function login(id, pass) {
  $.ajax({
    url: "./api/authenticate",
    type: 'POST',
    dataType: 'json',
    data: {
      id: id,
      password: pass
    }
  }).then(
  // 1つめは通信成功時のコールバック
  function (json) {
    getUsers();
  },
  // 2つめは通信失敗時のコールバック
  function () {
    alert("読み込み失敗");
  });
}

function getUsers() {
  $.ajax({
    url: "./api/users"
  }).then(
  // 1つめは通信成功時のコールバック
  function (json) {
    $("#result").text("success login");
    var len = json.length;
    for (var i = 0; i < len; i++) {
      console.log(json[i].name + ' ' + json[i].password);
    }
  },
  // 2つめは通信失敗時のコールバック
  function (data) {
    $("#result").text("error login");
  });
}