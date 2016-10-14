$(document).ready(function() {
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
      var m = moment(date);
      $(".datepicker").val(m.format('YYYY-MM-DD'));
      $("#js-modal").modal("show");
    },

    eventClick: function(event) {
      //TODO
      console.log(event);
      //console.dir(event); オブジェクトの中身をチェック。
      var title = prompt('予定を更新してください:');
      if(title && title!=""){
        event.title = title;
        //イベント（予定）の修正
        $('#js-calendar').fullCalendar('updateEvent', event);
      }else{
        //イベント（予定）の削除  idを指定して削除。
        $('#js-calendar').fullCalendar("removeEvents", event._id);
      }
    },
  });

  $(".datepicker").datepicker({
    format: "yyyy/mm/dd",
    language: "ja",
    autoclose: true
  });

  //スケジュール追加
  $("#js-submit").on("click", function () {
    var t = $("#js-title").val();
    var s = $("#js-datepicker-start").val();
    var e = $("#js-datepicker-end").val();
    addSchedule(t, s, e);
  });
});

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
          //疑似的にイベントを追加し表示する
          $('#js-calendar').fullCalendar('addEventSource', [{
              title: title,
              start: start,
              end: end
          }]);
        }
      },
      function () {
          alert("読み込み失敗");
      }
    );
}

//TODO
function deleteSchedule(title, start, end) {
  $.ajax({
      url: "./api/schedule",
      type:'DELETE',
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
          //疑似的にイベントを追加し表示する
          $('#js-calendar').fullCalendar('addEventSource', [{
              title: title,
              start: start,
              end: end
          }]);
        }
      },
      function () {
          alert("読み込み失敗");
      }
    );
}

//TODO
function updeteSchedule(title, start, end) {
  $.ajax({
      url: "./api/schedule/add",
      type:'PUT',
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
          //疑似的にイベントを追加し表示する
          $('#js-calendar').fullCalendar('addEventSource', [{
              title: title,
              start: start,
              end: end
          }]);
        }
      },
      function () {
          alert("読み込み失敗");
      }
    );
}
