'use strict';

var team_id = $('#js-team_id').text();
$(function () {
  // navbar
  $('#js-schedule').addClass('active');

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
      url: './api/schedule/' + team_id,
      dataType: 'json',
      async: false,
      type: 'GET',
      error: function error() {
        console.log('db err');
      }
    }],
    eventClick: function eventClick(event) {
      $('#js-title').val(event.title).parent().find('label').addClass('active');
      $('#js-location').val(event.location).parent().find('label').addClass('active');
      $('#js-memo').val(event.memo).parent().find('label').addClass('active');

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