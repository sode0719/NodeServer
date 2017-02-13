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


var ListScore = function ListScore(props) {
  var list = props.list.map(function (s, i) {
    function onClickDelete() {
      $.ajax({
        url: 'http://172.16.1.12:3000/api/score/' + s._id,
        type: 'DELETE',
        dataType: 'json'
      }).then(function (json) {
        window.location.reload();
      }.bind(this), function () {
        console.log('読み込み失敗');
      });
    }

    var styles = {
      a: {
        display: 'block',
        height: '100%',
        width: '100%'
      }
    };

    return React.createElement(
      'tr',
      { key: i },
      React.createElement(
        'td',
        null,
        React.createElement(
          'a',
          { href: '/score/' + s._id, style: styles.a },
          s.date
        )
      ),
      React.createElement(
        'td',
        null,
        React.createElement(
          'a',
          { href: '/score/' + s._id, style: styles.a },
          s.gameName
        )
      ),
      React.createElement(
        'td',
        null,
        React.createElement(
          'a',
          { href: '/score/' + s._id, style: styles.a },
          s.venue
        )
      ),
      React.createElement(
        'td',
        null,
        React.createElement(
          Button,
          { color: 'primary', size: 'sm', onClick: onClickDelete },
          '\u524A\u9664'
        )
      )
    );
  });

  return React.createElement(
    'tbody',
    null,
    list
  );
};

var Score = function (_React$Component) {
  _inherits(Score, _React$Component);

  function Score(props) {
    _classCallCheck(this, Score);

    var _this = _possibleConstructorReturn(this, (Score.__proto__ || Object.getPrototypeOf(Score)).call(this, props));

    _this.state = {
      team_id: $('#js-team_id').text(),
      list: []
    };
    return _this;
  }

  _createClass(Score, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      $.ajax({
        url: 'http://172.16.1.12:3000/api/score/team/' + this.state.team_id,
        type: 'GET',
        dataType: 'json'
      }).then(function (json) {
        this.setState({ list: json });
      }.bind(this), function () {
        console.log('読み込み失敗');
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.state.list.length === 0) {
        return React.createElement(
          'div',
          { className: 'alert alert-info' },
          '\u30B9\u30B3\u30A2\u30B7\u30FC\u30C8\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093'
        );
      } else {
        return React.createElement(
          'div',
          null,
          React.createElement(
            Table,
            { hover: true },
            React.createElement(
              'thead',
              null,
              React.createElement(
                'tr',
                null,
                React.createElement(
                  'th',
                  null,
                  '\u65E5\u4ED8'
                ),
                React.createElement(
                  'th',
                  null,
                  '\u8A66\u5408\u540D'
                ),
                React.createElement(
                  'th',
                  null,
                  '\u4F1A\u5834'
                ),
                React.createElement(
                  'th',
                  null,
                  '\u7DE8\u96C6'
                )
              )
            ),
            React.createElement(ListScore, { list: this.state.list })
          )
        );
      }
    }
  }]);

  return Score;
}(React.Component);

ReactDOM.render(React.createElement(Score, null), document.getElementById('score-list'));