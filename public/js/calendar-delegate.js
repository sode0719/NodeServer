'use strict';

$(function () {
  var ev = null;
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
    dayClick: function dayClick(date, allDay, jsEvent, view) {
      fromReset();
      $('#js-delete').remove();
      var m = moment(date);
      $('.datepicker').val(m.format('YYYY-MM-DD'));
      $('#js-submit').text('登録');
      $('#js-delete').remove();
      validationReset();
      // モーダル表示
      $('#js-modal').modal('show');
    },

    eventClick: function eventClick(event) {
      $('#js-title').val(event.title);
      $('#js-location').val(event.location);
      $('#js-memo').val(event.memo);
      $('#js-delete').remove();
      $('#modal-footer').append('<button class="btn btn-danger pull-left" id="js-delete" data-dismiss="modal">削除</button>');

      $('#js-datepicker-start').val(event.start._i.split(' ')[0]);
      if (event.end === null) {
        event.end = event.start;
        $('#js-datepicker-end').val(event.start._i.split(' ')[0]);
      } else {
        $('#js-datepicker-end').val(event.end._i.split(' ')[0]);
      }
      ev = event;

      $('#js-submit').text('更新');
      validationReset();
      // モーダル表示
      $('#js-modal').modal('show');
    }
  });

  // デイトピッカーの設定
  $('.datepicker').datepicker({
    format: 'yyyy-mm-dd',
    language: 'ja',
    autoclose: true
  });

  // スケジュールモーダル
  $('#js-submit').on('click', function () {
    validationReset();
    var err = false;
    // バリデーション
    var title = $('#js-title').val();
    if (title === '') {
      validationAnimation('#js-title');
      validationErrorMessage('タイトルを入力してください');
      err = true;
    }

    var start = $('#js-datepicker-start').val();
    if (start === '') {
      validationAnimation('#js-datepicker-start');
      validationErrorMessage('開始日を選択してください');
      err = true;
    }
    var end = $('#js-datepicker-end').val();
    if (end === '') {
      validationAnimation('#js-datepicker-end');
      validationErrorMessage('終了日を選択してください');
      err = true;
    }

    // -を削除して比較
    var s = start.replace(/-/g, '');
    var e = end.replace(/-/g, '');
    if (Number(s) > Number(e)) {
      validationAnimation('#js-datepicker-start');
      validationAnimation('#js-datepicker-end');
      validationErrorMessage('開始日が終了日を越えています');

      err = true;
    }

    if (err) {
      return false;
    }

    var location = $('#js-location').val();
    var memo = $('#js-memo').val();

    var text = $('#js-submit').text();
    if (text === '登録') {
      addSchedule(title, start, end, location, memo);
    } else if (text === '更新') {
      updateSchedule(ev, title, start, end);
    }
  });

  $(document).on('click', '#js-delete', function () {
    $('#js-modal-confirm').modal('show');
  });

  $('#js-submit-delete').on('click', function () {
    deleteSchedule(ev._id);
  });
});

function validationAnimation(selector) {
  $(selector).parent().addClass('has-error');
  $(selector).parent().stop().animate({ opacity: '0.3' }, 250).animate({ opacity: '1.0' }, 250).animate({ opacity: '0.3' }, 250).animate({ opacity: '1.0' }, 250);
}

function validationErrorMessage(text) {
  $('#js-error-messages').append('<div class="alert alert-danger">' + text + '</div>');
}
function validationReset() {
  $('#js-error-messages').empty();
  $('.has-error').removeClass('has-error');
}

// 追加
function addSchedule(title, start, end, location, memo) {
  $.ajax({
    url: './api/schedule',
    type: 'POST',
    dataType: 'json',
    data: {
      title: title,
      start: start,
      end: end,
      location: location,
      memo: memo
    }
  }).then(function (json) {
    if (json.success) {
      window.location.reload();
    }
  }, function () {
    alert('読み込み失敗');
  });
}

// 削除
function deleteSchedule(id) {
  $.ajax({
    url: './api/schedule',
    type: 'DELETE',
    dataType: 'json',
    data: { _id: id }
  }).then(function (json) {
    if (json.success) {
      window.location.reload();
    }
  }, function () {
    alert('読み込み失敗');
  });
}

// 更新
function updateSchedule(event, title, start, end) {
  $.ajax({
    url: './api/schedule',
    type: 'PUT',
    dataType: 'json',
    data: {
      _id: event._id,
      team_id: event.team_id,
      title: title,
      start: start,
      end: end
    }
  }).then(function (json) {
    if (json.success) {
      window.location.reload();
    }
  }, function () {
    alert('読み込み失敗');
  });
}

function fromReset() {
  $('#js-title').val('');
  $('#js-location').val('');
  $('#js-memo').val('');
}