'use strict';

const team_id = $('#js-team_id').text();
$(function() {
  // navbar
  $('#js-schedule').addClass('active');

  let ev = null;
  $('#js-calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month',
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
      error: function() {
        console.log('db err');
      },
    }],
    dayClick: function(date, allDay, jsEvent, view) {
      const isYear = date._d.getFullYear() < new Date().getFullYear();
      const isMonth = date._d.getMonth() < new Date().getMonth();
      const isDate = date._d.getDate() < new Date().getDate();

      if(isYear || isMonth || isDate) {
        return false;
      }
      fromReset();
      $('#js-delete').remove();
      const m = moment(date);
      $('.datepicker').val(m.format('YYYY-MM-DD'));
      $('.datepicker').datepicker('setDate', new Date(date));
      $('#js-submit').text('登録');
      $('#js-delete').remove();
      $('.js-dispatcher').prop('checked', false);
      validationReset();
      // モーダル表示
      $('#js-modal').modal('show');
    },

    eventClick: function(event) {
      fromReset();
      $('#js-title').val(event.title).parent().find('label').addClass('active');
      $('#js-location').val(event.location).parent().find('label').addClass('active');
      $('#js-memo').val(event.memo).parent().find('label').addClass('active');
      $('#js-delete').remove();
      $('#modal-footer').append('<button class="btn btn-danger pull-left" id="js-delete" data-dismiss="modal">削除</button>');
      if(event.dispatcher) {
        $('.js-dispatcher').prop('checked', true);
        $('#js-aggregate-base').append('<div class="md-form"><input id="js-aggregate" type="text" class="form-control"/><label for="js-aggregate">集合場所</label></div>');
        $('#js-aggregate').val(event.aggregate).parent().find('label').addClass('active');
      } else {
        $('.js-dispatcher').prop('checked', false);
        $('#js-aggregate-base').empty();
      }

      $('#js-datepicker-start').val(event.start._i.split(' ')[0]);
      if(event.end === null) {
        event.end = event.start;
        $('#js-datepicker-end').val(event.start._i.split(' ')[0]);
      } else {
        $('#js-datepicker-end').val(event.end._i.split(' ')[0]);
      }
      ev = event;
      $('.datepicker').datepicker('setDate', new Date(event.start._i.split(' ')[0]));
      $('#js-submit').text('更新');
      validationReset();

      const date = new Date(event.start._i.split(' ')[0]);

      const isYear = date.getFullYear() < new Date().getFullYear();
      const isMonth = date.getMonth() < new Date().getMonth();
      const isDate = date.getDate() < new Date().getDate();
      if(isYear || isMonth || isDate) {
        $('#js-submit').prop('disabled', true);
      } else {
        $('#js-submit').prop('disabled', false);
      }

      // モーダル表示
      $('#js-modal').modal('show');
    },
  });

  // デイトピッカーの設定
  $('.datepicker').datepicker({
    format: 'yyyy-mm-dd',
    language: 'ja',
    autoclose: true,
  });

  $('.js-dispatcher').change(function() {
    if($(this).is(':checked')) {
      $('#js-aggregate-base').append('<div class="md-form"><input id="js-aggregate" type="text" class="form-control"/><label for="js-aggregate">集合場所</label></div>');
    } else {
      $('#js-aggregate-base').empty();
    }
  });

  // スケジュールモーダル
  $('#js-submit').on('click', function() {
    validationReset();
    let err = false;
    // バリデーション
    const title = $('#js-title').val();
    if(title === '') {
      validationAnimation('#js-title');
      validationErrorMessage('タイトルを入力してください');
      err = true;
    }

    const start = $('#js-datepicker-start').val();
    if(start === '') {
      validationAnimation('#js-datepicker-start');
      validationErrorMessage('開始日を選択してください');
      err = true;
    }
    const end = $('#js-datepicker-end').val();
    if(end === '') {
      validationAnimation('#js-datepicker-end');
      validationErrorMessage('終了日を選択してください');
      err = true;
    }

    // -を削除して比較
    const s = start.replace(/-/g, '');
    const e = end.replace(/-/g, '');
    if(Number(s) > Number(e)) {
      validationAnimation('#js-datepicker-start');
      validationAnimation('#js-datepicker-end');
      validationErrorMessage('開始日が終了日を越えています');

      err = true;
    }

    if(Number(start.split('-')[2]) < Number(new Date().getDate())) {
      validationAnimation('#js-datepicker-start');
      validationErrorMessage('今日より前のスケジュールを登録することはできません');

      err = true;
    }

    const aggregate = $('#js-aggregate').val();
    if($(this).is(':checked') && aggregate === '') {
      validationAnimation('#js-aggregate');
      validationErrorMessage('集合場所を入力してください');
      err = true;
    }

    if(err) {
      return false;
    }

    const location = $('#js-location').val();
    const memo = $('#js-memo').val();
    let dispatcher = false;
    if($('.js-dispatcher:checked').val() === 'on') {
      dispatcher = true;
    }

    const text = $('#js-submit').text();
    if(text === '登録') {
      addSchedule(title, start, end, location, memo, dispatcher, aggregate);
    } else if(text === '更新') {
      updateSchedule(ev, title, start, end, location, memo, dispatcher, aggregate);
    }
  });

  $(document).on('click', '#js-delete', function() {
    $('#js-modal-confirm').modal('show');
  });

  $('#js-submit-delete').on('click', function() {
    deleteSchedule(ev._id);
  });
});

function validationAnimation(selector) {
  $(selector).parent().addClass('has-error');
  $(selector).parent().stop()
    .animate({ opacity: '0.3' }, 250)
    .animate({ opacity: '1.0' }, 250)
    .animate({ opacity: '0.3' }, 250)
    .animate({ opacity: '1.0' }, 250);
}

function validationErrorMessage(text) {
  $('#js-error-messages').append('<div class="alert alert-danger">' + text + '</div>');
}
function validationReset() {
  $('#js-error-messages').empty();
  $('.has-error').removeClass('has-error');
}

// 追加
function addSchedule(title, start, end, location, memo, dispatcher, aggregate) {
  $.ajax({
    url: './api/schedule/' + team_id,
    type: 'POST',
    dataType: 'json',
    data: {
      title: title,
      start: start,
      end: end,
      location: location,
      memo: memo,
      dispatcher: dispatcher,
      aggregate: aggregate,
    },
  }).then(
      function(json) {
        if(json.success) {
          window.location.reload();
        }
      },
      function() {
        alert('読み込み失敗');
      }
    );
}

// 削除
function deleteSchedule(id) {
  $.ajax({
    url: './api/schedule',
    type: 'DELETE',
    dataType: 'json',
    data: {_id: id},
  }).then(
      function(json) {
        if(json.success) {
          window.location.reload();
        }
      },
      function() {
        alert('読み込み失敗');
      }
    );
}

// 更新
function updateSchedule(event, title, start, end, location, memo, dispatcher, aggregate) {
  $.ajax({
    url: './api/schedule',
    type: 'PUT',
    dataType: 'json',
    data: {
      _id: event._id,
      team_id: event.team_id,
      title: title,
      start: start,
      end: end,
      location: location,
      memo: memo,
      dispatcher: dispatcher,
      aggregate: aggregate,
    },
  }).then(
      function(json) {
        if(json.success) {
          window.location.reload();
        }
      },
      function() {
        alert('読み込み失敗');
      }
    );
}

function fromReset() {
  $('#js-aggregate-base').empty();
  $('#js-title').val('').parent().find('label').removeClass('active');
  $('#js-location').val('').parent().find('label').removeClass('active');
  $('#js-memo').val('').parent().find('label').removeClass('active');
}
