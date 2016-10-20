$(function() {
  $("#login").addClass("active");

  $("#js-submit").on('click', function () {
    var id = $("#js-user-id").val();
    var pass = $("#js-user-password").val();
    login(id, pass);
  });
});

function login(id, pass) {
  $.ajax({
      url: "./api/authenticate",
      type:'POST',
      dataType: 'json',
      data: {
        id : id,
        password : pass
      }
  })
  .then(
      // 1つめは通信成功時のコールバック
      function (json) {
        if(json.success) {
          console.log(json);
          window.location = "./";
        } else {
          $("#login-result").addClass("alert alert-danger");
          $("#login-result").text("ログインできません。");
        }
      },
      // 2つめは通信失敗時のコールバック
      function () {
          alert("読み込み失敗");
      }
    );
}
