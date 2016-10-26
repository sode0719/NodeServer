'use strict';

$(function () {
  // navbar
  $('#js-log').addClass('active');

  $('#js-submit').on('click', function () {
    var id = $('#js-user-id').val();
    var pass = $('#js-user-password').val();
    login(id, pass);
  });
});

function login(id, pass) {
  $.ajax({
    url: './api/authenticate',
    type: 'POST',
    dataType: 'json',
    data: {
      id: id,
      password: pass
    }
  }).then(
  // 1つめは通信成功時のコールバック
  function (json) {
    if (json.success) {
      console.log(json);
      window.location = './';
    } else {
      $('#login-result').empty();
      $('#login-result').append('<div class="alert alert-danger animated shake">ログインできません。</div>');
    }
  },
  // 2つめは通信失敗時のコールバック
  function () {
    alert('読み込み失敗');
  });
}