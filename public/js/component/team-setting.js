'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Reactstrap = Reactstrap;
var Row = _Reactstrap.Row;
var Col = _Reactstrap.Col;
var Button = _Reactstrap.Button;
var Form = _Reactstrap.Form;
var FormGroup = _Reactstrap.FormGroup;
var FormFeedback = _Reactstrap.FormFeedback;
var Label = _Reactstrap.Label;
var Input = _Reactstrap.Input;
var InputGroup = _Reactstrap.InputGroup;
var InputGroupButton = _Reactstrap.InputGroupButton;

var TeamSetting = function (_React$Component) {
  _inherits(TeamSetting, _React$Component);

  function TeamSetting(props) {
    _classCallCheck(this, TeamSetting);

    var _this = _possibleConstructorReturn(this, (TeamSetting.__proto__ || Object.getPrototypeOf(TeamSetting)).call(this, props));

    _this.state = {
      name: '',
      nameColor: 'success',
      home: [],
      hometext: '',
      users: []
    };

    _this.onChangeName = _this.onChangeName.bind(_this);
    _this.onClickAdd = _this.onClickAdd.bind(_this);
    _this.onClickDelete = _this.onClickDelete.bind(_this);
    _this.onChangeHomeText = _this.onChangeHomeText.bind(_this);
    _this.onClickSubmit = _this.onClickSubmit.bind(_this);

    _this.onChangeDelegate = _this.onChangeDelegate.bind(_this);
    return _this;
  }

  _createClass(TeamSetting, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      $.ajax({
        url: 'http://172.16.1.12:3000/api/team/' + $('#js-id').text(),
        type: 'GET',
        dataType: 'json'
      }).then(function (json) {
        var data = json[0];
        this.setState({
          name: data.name,
          home: data.home
        });
      }.bind(this), function () {
        console.log('読み込み失敗');
      });

      $.ajax({
        url: 'http://172.16.1.12:3000/api/team/user/' + $('#js-id').text(),
        type: 'GET',
        dataType: 'json'
      }).then(function (json) {
        this.setState({
          users: json
        });
      }.bind(this), function () {
        console.log('読み込み失敗');
      });
    }
  }, {
    key: 'onClickDelete',
    value: function onClickDelete(num) {
      if (this.state.home.length === 1) {
        alert('削除できません');
        return false;
      }
      var temp = this.state.home;
      temp.splice(num, 1);
      this.setState({
        home: temp
      });
    }
  }, {
    key: 'onChangeHomeText',
    value: function onChangeHomeText(e) {
      this.setState({
        hometext: e.target.value
      });
    }
  }, {
    key: 'onClickAdd',
    value: function onClickAdd() {
      if (this.state.hometext === '') {
        return false;
      }

      this.setState({
        home: this.state.home.concat(this.state.hometext),
        hometext: ''
      });
    }
  }, {
    key: 'onChangeName',
    value: function onChangeName(e) {
      if (e.target.value === '') {
        this.setState({
          nameColor: 'danger'
        });
      } else {
        this.setState({
          nameColor: 'success'
        });
      }

      this.setState({
        name: e.target.value
      });
    }
  }, {
    key: 'onClickSubmit',
    value: function onClickSubmit() {
      var result = true;
      if (this.state.name === '') {
        result = false;
      }

      if (result) {
        $.ajax({
          url: 'http://172.16.1.12:3000/api/team/' + $('#js-id').text(),
          type: 'PUT',
          dataType: 'json',
          data: {
            name: this.state.name,
            home: JSON.stringify(this.state.home),
            users: JSON.stringify(this.state.users)
          }
        }).then(function (json) {
          console.log(json);
          if (json.success) {
            alert('更新しました');
            location.reload();
          }
        }, function () {
          console.log('読み込み失敗');
        });
      }
    }
  }, {
    key: 'onChangeDelegate',
    value: function onChangeDelegate(data) {
      var temp = this.state.users.map(function (user) {
        var u = clone(user);
        if (data.id === u._id) {
          u.delegate = data.delegate;
        }

        return u;
      });

      var count = temp.map(function (user) {
        return user.delegate;
      });

      if (!count.includes(true)) {
        alert('チームに代表者は一人以上必要です');
      } else {
        this.setState({
          users: temp
        });
      }

      function clone(obj) {
        var newObj = {};
        for (var key in obj) {
          newObj[key] = obj[key];
        }

        return newObj;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var homeList = this.state.home.map(function (data, i) {
        return React.createElement(
          'div',
          { key: i, style: { marginTop: '10px' } },
          React.createElement(
            Row,
            null,
            React.createElement(
              Col,
              { sm: 10 },
              React.createElement(
                'h3',
                { className: 'text-sm-center' },
                i + 1,
                ' - ',
                data
              )
            ),
            React.createElement(
              Col,
              { sm: 2 },
              React.createElement(
                Button,
                { color: 'danger', onClick: _this2.onClickDelete.bind(_this2, i) },
                React.createElement('i', { className: 'fa fa-minus', 'aria-hidden': 'true' })
              )
            )
          )
        );
      });

      var userList = this.state.users.map(function (u, i) {
        return React.createElement(
          'div',
          { style: { paddingLeft: '15px' }, key: i },
          React.createElement(User, _extends({}, u, { onCallBack: _this2.onChangeDelegate }))
        );
      });
      return React.createElement(
        'div',
        { style: { marginBottom: '25px' } },
        React.createElement(
          FormGroup,
          { color: this.state.nameColor },
          React.createElement(
            Label,
            null,
            React.createElement(
              'h4',
              null,
              '\u30C1\u30FC\u30E0\u540D'
            )
          ),
          React.createElement(Input, { type: 'text', placeholder: '\u30C1\u30FC\u30E0\u540D', value: this.state.name, state: this.state.nameColor, onChange: this.onChangeName })
        ),
        React.createElement('hr', null),
        React.createElement(
          FormGroup,
          null,
          React.createElement(
            Label,
            null,
            React.createElement(
              'h4',
              null,
              '\u30DB\u30FC\u30E0\u30B0\u30E9\u30A6\u30F3\u30C9'
            )
          ),
          homeList,
          React.createElement(
            Row,
            { style: { marginTop: '10px' } },
            React.createElement(
              Col,
              { sm: 7 },
              React.createElement(Input, { type: 'text', placeholder: '\u65B0\u3057\u3044\u30DB\u30FC\u30E0\u30B0\u30E9\u30A6\u30F3\u30C9', value: this.state.hometext, onChange: this.onChangeHomeText })
            ),
            React.createElement(
              Col,
              { sm: 5 },
              React.createElement(
                Button,
                { color: 'info', size: 'lg', onClick: this.onClickAdd, block: true },
                '\u8FFD\u52A0'
              )
            )
          )
        ),
        React.createElement('hr', null),
        React.createElement(
          'h4',
          { style: { paddingBottom: '15px' } },
          '\u30D1\u30FC\u30DF\u30C3\u30B7\u30E7\u30F3'
        ),
        React.createElement(
          'div',
          null,
          userList
        ),
        React.createElement('hr', null),
        React.createElement(
          Button,
          { color: 'primary', size: 'lg', block: true, onClick: this.onClickSubmit },
          '\u66F4\u65B0'
        )
      );
    }
  }]);

  return TeamSetting;
}(React.Component);

var User = function (_React$Component2) {
  _inherits(User, _React$Component2);

  function User(props) {
    _classCallCheck(this, User);

    var _this3 = _possibleConstructorReturn(this, (User.__proto__ || Object.getPrototypeOf(User)).call(this, props));

    _this3.state = {};

    _this3.onClickDelegate = _this3.onClickDelegate.bind(_this3);
    return _this3;
  }

  _createClass(User, [{
    key: 'onClickDelegate',
    value: function onClickDelegate(id, e) {
      this.props.onCallBack({
        id: this.props._id,
        delegate: !this.props.delegate
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        Row,
        { style: { marginBottom: '15px' } },
        React.createElement(
          Col,
          { sm: 9 },
          React.createElement(
            'h4',
            null,
            this.props.name
          )
        ),
        React.createElement(
          Col,
          { sm: 3 },
          React.createElement(
            Button,
            { color: this.props.delegate ? 'orange' : 'blue-grey', onClick: this.onClickDelegate, block: true },
            this.props.delegate ? '代表' : '一般'
          )
        )
      );
    }
  }]);

  return User;
}(React.Component);

ReactDOM.render(React.createElement(TeamSetting, null), document.getElementById('setting'));