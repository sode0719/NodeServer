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
    events: [
      {
        title: 'All Day Event',
        start: '2016-10-01'
      },
      {
        title: 'Long Event',
        start: '2016-10-07',
        end: '2016-10-10'
      },
      {
        id: 999,
        title: 'Repeating Event',
        start: '2016-10-09T16:00:00'
      },
      {
        id: 999,
        title: 'Repeating Event',
        start: '2016-10-16T16:00:00'
      },
      {
        title: 'Conference',
        start: '2016-10-11',
        end: '2016-10-13'
      },
      {
        title: 'Meeting',
        start: '2016-10-12T10:30:00',
        end: '2016-10-12T12:30:00'
      },
      {
        title: 'Lunch',
        start: '2016-10-12T12:00:00'
      },
      {
        title: 'Meeting',
        start: '2016-10-12T14:30:00'
      },
      {
        title: 'Happy Hour',
        start: '2016-10-12T17:30:00'
      },
      {
        title: 'Dinner',
        start: '2016-10-12T20:00:00'
      },
      {
        title: 'Birthday Party',
        start: '2016-10-13T07:00:00'
      },
      {
        title: 'Click for Google',
        url: 'http://google.com/',
        start: '2016-10-28'
      }
    ],
    dayClick: function(date, allDay, jsEvent, view) {
      var title = prompt('予定を入力してください:');
      $('#calendar').fullCalendar('addEventSource', [{
          id:date,
          title: title,
          start: date,
          allDay: allDay
      }]);
    },

    eventClick: function(event) {
      //console.dir(event); オブジェクトの中身をチェック。
      var title = prompt('予定を更新してください:');
      if(title && title!=""){
        event.title = title;
        //イベント（予定）の修正
        $('#calendar').fullCalendar('updateEvent', event);
      }else{
        //イベント（予定）の削除  idを指定して削除。
        $('#calendar').fullCalendar("removeEvents", event._id);
      }
    },
  });
});
