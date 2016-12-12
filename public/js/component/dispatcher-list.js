'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Reactstrap = Reactstrap;
var Button = _Reactstrap.Button;
var Table = _Reactstrap.Table;
var Modal = _Reactstrap.Modal;
var ModalHeader = _Reactstrap.ModalHeader;
var ModalBody = _Reactstrap.ModalBody;
var ModalFooter = _Reactstrap.ModalFooter;
var FormGroup = _Reactstrap.FormGroup;
var Label = _Reactstrap.Label;
var Input = _Reactstrap.Input;


var Complete = function Complete(props) {
  if (props.length !== 0) {
    return React.createElement("i", { className: "fa fa-check", "aria-hidden": "true" });
  }

  return null;
};

var ListDispatcher = function ListDispatcher(props) {
  var list = props.list.map(function (d, i) {
    function onClickDelete() {
      $.ajax({
        url: 'http://localhost:3000/api/dispatcher/' + d._id,
        type: 'DELETE',
        dataType: 'json'
      }).then(function (json) {
        window.location.reload();
      }.bind(this), function () {
        console.log('読み込み失敗');
      });
    }

    return React.createElement(
      "tr",
      { key: i },
      React.createElement(
        "td",
        null,
        React.createElement(
          "a",
          { href: '/dispatcher/' + d._id },
          d._id
        )
      ),
      React.createElement(
        "td",
        null,
        d.title
      ),
      React.createElement(
        "td",
        null,
        d.date.split('T')[0]
      ),
      React.createElement(
        "td",
        null,
        d.aggregate
      ),
      React.createElement(
        "td",
        null,
        d.destination
      ),
      React.createElement(
        "td",
        null,
        React.createElement(Complete, { length: d.divide.length })
      ),
      React.createElement(
        "td",
        null,
        React.createElement(
          Button,
          { color: "primary", size: "sm", onClick: onClickDelete },
          "\u524A\u9664"
        )
      )
    );
  });

  return React.createElement(
    "tbody",
    null,
    list
  );
};

var Dispatcher = function (_React$Component) {
  _inherits(Dispatcher, _React$Component);

  function Dispatcher(props) {
    _classCallCheck(this, Dispatcher);

    var _this = _possibleConstructorReturn(this, (Dispatcher.__proto__ || Object.getPrototypeOf(Dispatcher)).call(this, props));

    _this.state = {
      team_id: $('#js-team_id').text(),
      dispatcherList: []
    };
    return _this;
  }

  _createClass(Dispatcher, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var d = new Date();
      var m = Number(d.getMonth() + 1);
      var month = m < 10 ? '0' + m : m;
      var date = d.getFullYear() + '-' + month + '-' + d.getDate();
      $.ajax({
        url: 'http://localhost:3000/api/dispatcher/team/' + this.state.team_id,
        type: 'GET',
        dataType: 'json',
        data: { date: date }
      }).then(function (json) {
        this.setState({ dispatcherList: json });
      }.bind(this), function () {
        console.log('読み込み失敗');
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(ModalAdd, { teamId: this.state.team_id }),
        React.createElement(
          Table,
          null,
          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                null,
                "id"
              ),
              React.createElement(
                "th",
                null,
                "\u30BF\u30A4\u30C8\u30EB"
              ),
              React.createElement(
                "th",
                null,
                "\u65E5\u4ED8"
              ),
              React.createElement(
                "th",
                null,
                "\u96C6\u5408\u5834\u6240"
              ),
              React.createElement(
                "th",
                null,
                "\u76EE\u7684\u5730"
              ),
              React.createElement(
                "th",
                null,
                "\u914D\u8ECA\u5B8C\u4E86"
              ),
              React.createElement(
                "th",
                null,
                "\u524A\u9664"
              )
            )
          ),
          React.createElement(ListDispatcher, { list: this.state.dispatcherList })
        )
      );
    }
  }]);

  return Dispatcher;
}(React.Component);

var ModalAdd = function (_React$Component2) {
  _inherits(ModalAdd, _React$Component2);

  function ModalAdd(props) {
    _classCallCheck(this, ModalAdd);

    var _this2 = _possibleConstructorReturn(this, (ModalAdd.__proto__ || Object.getPrototypeOf(ModalAdd)).call(this, props));

    _this2.state = {
      modal: false,
      team_id: _this2.props.teamId,
      title: '',
      date: new Date(),
      aggregate: '',
      destination: ''
    };

    _this2.toggle = _this2.toggle.bind(_this2);

    _this2.handleChangeTitle = _this2.handleChangeTitle.bind(_this2);
    _this2.handleChangeAggregate = _this2.handleChangeAggregate.bind(_this2);
    _this2.handleChangeDestination = _this2.handleChangeDestination.bind(_this2);

    _this2.onClickSubmit = _this2.onClickSubmit.bind(_this2);
    return _this2;
  }

  _createClass(ModalAdd, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      // デイトピッカーの設定
      $('.datepicker').datepicker({
        format: 'yyyy-mm-dd',
        language: 'ja',
        autoclose: true
      });
      $('.datepicker').datepicker('setDate', this.state.date);
    }
  }, {
    key: "toggle",
    value: function toggle() {
      this.setState({ modal: !this.state.modal });
    }
  }, {
    key: "handleChangeTitle",
    value: function handleChangeTitle(event) {
      this.setState({ title: event.target.value });
    }
  }, {
    key: "handleChangeAggregate",
    value: function handleChangeAggregate(event) {
      this.setState({ aggregate: event.target.value });
    }
  }, {
    key: "handleChangeDestination",
    value: function handleChangeDestination(event) {
      this.setState({ destination: event.target.value });
    }
  }, {
    key: "onClickSubmit",
    value: function onClickSubmit() {
      var _this3 = this;

      this.toggle();
      this.setState({ date: $('.datepicker').val() }, function () {
        console.log(_this3.state);
        $.ajax({
          url: 'http://localhost:3000/api/dispatcher/',
          type: 'POST',
          dataType: 'json',
          data: {
            team_id: _this3.state.team_id,
            title: _this3.state.title,
            date: _this3.state.date,
            aggregate: _this3.state.aggregate,
            destination: _this3.state.destination
          }
        }).then(function (json) {
          console.log(json);
          window.location.reload();
        }.bind(_this3), function () {
          console.log('読み込み失敗');
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          Button,
          { color: "primary", onClick: this.toggle },
          "\u65B0\u898F\u767B\u9332"
        ),
        React.createElement(
          Modal,
          { isOpen: this.state.modal, toggle: this.toggle, className: this.props.className },
          React.createElement(
            ModalHeader,
            { toggle: this.toggle },
            "\u65B0\u898F\u914D\u8ECA\u767B\u9332"
          ),
          React.createElement(
            ModalBody,
            null,
            React.createElement(
              FormGroup,
              null,
              React.createElement(
                Label,
                null,
                React.createElement(
                  "h4",
                  null,
                  "\u30BF\u30A4\u30C8\u30EB"
                )
              ),
              React.createElement(Input, { type: "text", placeholder: "\u30BF\u30A4\u30C8\u30EB", onChange: this.handleChangeTitle })
            ),
            React.createElement(
              "div",
              { className: "form-group" },
              React.createElement(
                "label",
                null,
                React.createElement(
                  "h4",
                  null,
                  "\u65E5\u4ED8"
                )
              ),
              React.createElement("input", { type: "text", className: "form-control datepicker", placeholder: "\u65E5\u4ED8", readOnly: true })
            ),
            React.createElement(
              FormGroup,
              null,
              React.createElement(
                Label,
                null,
                React.createElement(
                  "h4",
                  null,
                  "\u96C6\u5408\u5834\u6240"
                )
              ),
              React.createElement(Input, { type: "text", placeholder: "\u96C6\u5408\u5834\u6240", onChange: this.handleChangeAggregate })
            ),
            React.createElement(
              FormGroup,
              null,
              React.createElement(
                Label,
                null,
                React.createElement(
                  "h4",
                  null,
                  "\u76EE\u7684\u5730"
                )
              ),
              React.createElement(Input, { type: "text", placeholder: "\u76EE\u7684\u5730", onChange: this.handleChangeDestination })
            )
          ),
          React.createElement(
            ModalFooter,
            null,
            React.createElement(
              Button,
              { className: "pull-left", color: "blue-grey", onClick: this.toggle },
              "\u30AD\u30E3\u30F3\u30BB\u30EB"
            ),
            React.createElement(
              Button,
              { color: "primary", onClick: this.onClickSubmit },
              "\u767B\u9332"
            )
          )
        )
      );
    }
  }]);

  return ModalAdd;
}(React.Component);

ReactDOM.render(React.createElement(Dispatcher, null), document.getElementById('dispatcher-list'));