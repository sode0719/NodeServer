$(function() {
  var ev = null;
  $('#js-calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    timeFormat: 'H:mm',
    editable: false, // 変更不可にする
    eventLimit: true, // 表示上限
    eventLimitClick:'popover',
    eventSources: [{
      url: './api/schedule',
      dataType: 'json',
      async: false,
      type: 'GET',
      data: {
          flg: 1
      },
      error: function () {
        console.log("db err");
      }
    }],
    dayClick: function(date, allDay, jsEvent, view) {
      $("#js-title").val("");
      $("#js-delete").remove();
      var m = moment(date);
      $(".datepicker").val(m.format('YYYY-MM-DD'));
      $("#js-submit").text("登録");
      $("#js-delete").remove();
      //モーダル表示
      $("#js-modal").modal("show");
    },

    eventClick: function(event) {
      $("#js-title").val(event.title);
      $("#js-delete").remove();
      $(".modal-footer").append("<button class='btn btn-danger pull-left' id='js-delete' data-dismiss='modal'>削除</button>");

      $("#js-datepicker-start").val(event.start._i);
      if (event.end === null) {
        event.end = event.start;
        $("#js-datepicker-end").val(event.start._i);
      } else {
        $("#js-datepicker-end").val(event.end._i);
      }
      ev = event;

      $("#js-submit").text("更新");
      $("#js-modal").modal("show");
    },
  });

  //デイトピッカーの設定
  $(".datepicker").datepicker({
    format: "yyyy-mm-dd",
    language: "ja",
    autoclose: true
  });

  //スケジュール
  $("#js-submit").on("click", function () {
    var title = $("#js-title").val();
    var start = $("#js-datepicker-start").val();
    var end = $("#js-datepicker-end").val();

    var text = $("#js-submit").text();
    if (text === "登録") {
      addSchedule(title, start, end);
    } else if (text === "更新") {
      updateSchedule(ev, title, start, end);
    }
  });

  $(document).on("click", "#js-delete", function () {
    console.log("del");
    deleteSchedule(ev._id)
  });
});

//追加
function addSchedule(title, start, end) {
  $.ajax({
      url: "./api/schedule",
      type:'POST',
      dataType: 'json',
      data: {
        title: title,
        start: start,
        end: end
      }
  })
  .then(
      function (json) {
        if (json.success) {
          location.reload();
        }
      },
      function () {
          alert("読み込み失敗");
      }
    );
}

//削除
function deleteSchedule(id) {
  $.ajax({
      url: "./api/schedule",
      type: 'DELETE',
      dataType: 'json',
      data: {
        _id: id,
      }
  })
  .then(
      function (json) {
        if (json.success) {
          location.reload();
        }
      },
      function () {
          alert("読み込み失敗");
      }
    );
}

//更新
function updateSchedule(event, title, start, end) {
  $.ajax({
      url: "./api/schedule",
      type: 'PUT',
      dataType: 'json',
      data: {
        _id: event._id,
        team_id: event.team_id,
        title: title,
        start: start,
        end: end
      }
  })
  .then(
      function (json) {
        if (json.success) {
          location.reload();
        }
      },
      function () {
          alert("読み込み失敗");
      }
    );
}
