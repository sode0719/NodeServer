'use strict';

$(function () {
  $('#js-calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month'
    },
    weekends: true,
    timeFormat: 'H:mm',
    editable: false,
    eventLimit: true,
    eventLimitClick: 'popover',
    eventSources: [{
      url: './api/schedule',
      dataType: 'json',
      async: false,
      type: 'GET',
      data: { flg: 1 },
      error: function error() {
        console.log('db err');
      }
    }],
    eventClick: function eventClick(event) {
      $('#js-title').val(event.title);
      $('#js-location').val(event.location);
      $('#js-memo').val(event.memo);

      $('#js-datepicker-start').val(event.start._i.split(' ')[0]);
      if (event.end === null) {
        $('#js-datepicker-end').val(event.start._i.split(' ')[0]);
      } else {
        $('#js-datepicker-end').val(event.end._i.split(' ')[0]);
      }

      // モーダル表示
      $('#js-modal').modal('show');
    }
  });
});