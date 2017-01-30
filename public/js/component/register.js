'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Reactstrap = Reactstrap;
var Button = _Reactstrap.Button;
var Form = _Reactstrap.Form;
var FormGroup = _Reactstrap.FormGroup;
var FormFeedback = _Reactstrap.FormFeedback;
var Label = _Reactstrap.Label;
var Input = _Reactstrap.Input;
var InputGroup = _Reactstrap.InputGroup;
var InputGroupButton = _Reactstrap.InputGroupButton;


var PassErrorMessage = function PassErrorMessage(props) {
  if (props.color === '' || props.color === 'success') {
    return React.createElement(
      FormFeedback,
      null,
      '\u82F1\u6570\u5B578\u6587\u5B57\u4EE5\u4E0A'
    );
  } else if (props.color === 'danger') {
    return React.createElement(
      FormFeedback,
      null,
      '\u6587\u5B57\u6570\u304C\u8DB3\u308A\u306A\u3044\u304B\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u4E00\u81F4\u3057\u307E\u305B\u3093'
    );
  }
};

var IdErrorMessage = function IdErrorMessage(props) {
  if (props.color === 'danger') {
    return React.createElement(
      FormFeedback,
      null,
      '\u5165\u529B\u3057\u305FID\u306F\u65E2\u306B\u4F7F\u7528\u3055\u308C\u3066\u3044\u307E\u3059'
    );
  } else if (props.color === '') {
    return null;
  } else if (props.color === 'success') {
    return React.createElement(
      FormFeedback,
      null,
      '\u5165\u529B\u3057\u305FID\u306F\u4F7F\u7528\u53EF\u80FD\u3067\u3059'
    );
  } else if (props.color === 'warning') {
    return React.createElement(
      FormFeedback,
      null,
      '\u4F7F\u7528\u53EF\u80FD\u304B\u30C1\u30A7\u30C3\u30AF\u3057\u3066\u304F\u3060\u3055\u3044'
    );
  }
};

var ListTeam = function ListTeam(props) {
  var list = props.teams.map(function (team, i) {
    return React.createElement(
      'option',
      { key: i, value: team._id },
      team.name
    );
  });

  function clickEvent(e) {
    props.onEventCallBack({ value: e.target.value });
  }

  return React.createElement(
    Input,
    { type: 'select', color: props.teamColor, onChange: clickEvent },
    React.createElement(
      'option',
      null,
      '\u6240\u5C5E\u30C1\u30FC\u30E0\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044'
    ),
    list
  );
};

var Register = function (_React$Component) {
  _inherits(Register, _React$Component);

  function Register(props) {
    _classCallCheck(this, Register);

    var _this = _possibleConstructorReturn(this, (Register.__proto__ || Object.getPrototypeOf(Register)).call(this, props));

    _this.state = {
      teams: [],
      id: '',
      idUsed: false,
      idColor: '',
      name: '',
      nameColor: 'warning',
      pass: '',
      passCollation: '',
      passColor: '',
      team: '',
      teamColor: 'warning',
      car: '',
      carColor: 'warning'
    };

    // handle
    _this.handleChangeId = _this.handleChangeId.bind(_this);
    _this.handleChangeName = _this.handleChangeName.bind(_this);
    _this.handleChangePass = _this.handleChangePass.bind(_this);
    _this.handleChangePassCollation = _this.handleChangePassCollation.bind(_this);
    _this.handleChangeTeam = _this.handleChangeTeam.bind(_this);
    _this.handleChangeCar = _this.handleChangeCar.bind(_this);
    // onClick
    _this.onClickCheckId = _this.onClickCheckId.bind(_this);
    _this.onClickSubmit = _this.onClickSubmit.bind(_this);
    // method
    _this.isMatch = _this.isMatch.bind(_this);
    _this.findUserId = _this.findUserId.bind(_this);
    return _this;
  }

  _createClass(Register, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      $.ajax({
        url: 'http://172.16.1.12:3000/api/team/all',
        type: 'GET',
        dataType: 'json',
        data: {}
      }).then(function (json) {
        this.setState({ teams: json });
      }.bind(this), function () {
        console.log('読み込み失敗');
      });
    }

    //--------------------------------------------------
    // handleChange
    //--------------------------------------------------

  }, {
    key: 'handleChangeId',
    value: function handleChangeId(event) {
      this.setState({
        id: event.target.value,
        idColor: 'warning'
      });
    }
  }, {
    key: 'handleChangeName',
    value: function handleChangeName(event) {
      var _this2 = this;

      this.setState({ name: event.target.value }, function () {
        if (_this2.state.name !== '') {
          _this2.state.nameColor = 'success';
        } else {
          _this2.state.nameColor = 'warning';
        }
      });
    }
  }, {
    key: 'handleChangePass',
    value: function handleChangePass(event) {
      var _this3 = this;

      this.setState({ pass: event.target.value }, function () {
        _this3.isMatch();
      });
    }
  }, {
    key: 'handleChangePassCollation',
    value: function handleChangePassCollation(event) {
      var _this4 = this;

      this.setState({ passCollation: event.target.value }, function () {
        _this4.isMatch();
      });
    }
  }, {
    key: 'handleChangeTeam',
    value: function handleChangeTeam(event) {
      if (event.value === '所属チーム選択してください') {
        this.setState({
          team: '',
          teamColor: 'warning'
        });
      } else {
        this.setState({
          team: event.value,
          teamColor: 'success'
        });
      }
    }
  }, {
    key: 'handleChangeCar',
    value: function handleChangeCar(event) {
      if (event.value === '車の定員を選択してください') {
        this.setState({
          car: '',
          carColor: 'warning'
        });
      } else {
        this.setState({
          car: event.target.value,
          carColor: 'success'
        });
      }
    }

    //--------------------------------------------------
    // onClick
    //--------------------------------------------------

  }, {
    key: 'onClickCheckId',
    value: function onClickCheckId() {
      if (this.state.id !== '') {
        this.findUserId(this.state.id);
      }
    }
  }, {
    key: 'onClickSubmit',
    value: function onClickSubmit() {
      var result = true;
      if (this.state.idColor !== 'success') {
        result = false;
      }
      if (this.state.name === '') {
        result = false;
      }
      if (this.state.passColor !== 'success') {
        result = false;
      }
      if (this.state.teamColor !== 'success') {
        result = false;
      }
      if (this.state.carColor !== 'success') {
        result = false;
      }

      console.log(result);
      // if(result) {
      //   $.ajax({
      //     url: 'http://172.16.1.12:3000/api/user/' + id,
      //     type: 'POST',
      //     dataType: 'json',
      //   }).then(
      //       function(json) {
      //         if(json.success) {
      //           this.setState({idColor: 'danger'});
      //         } else {
      //           this.setState({idColor: 'success'});
      //         }
      //       }.bind(this),
      //       function() {
      //         console.log('読み込み失敗');
      //       });
      // }
    }

    //--------------------------------------------------
    // method
    //--------------------------------------------------

  }, {
    key: 'isMatch',
    value: function isMatch() {
      if (this.state.pass === this.state.passCollation && (this.state.pass.length >= 8 || this.state.passCollation.length >= 8)) {
        this.setState({ passColor: 'success' });
      } else {
        this.setState({ passColor: 'danger' });
      }
    }
  }, {
    key: 'findUserId',
    value: function findUserId(id) {
      $.ajax({
        url: 'http://172.16.1.12:3000/api/user/check/' + id,
        type: 'GET',
        dataType: 'json'
      }).then(function (json) {
        if (json.find) {
          this.setState({ idColor: 'danger' });
        } else {
          this.setState({ idColor: 'success' });
        }
      }.bind(this), function () {
        console.log('読み込み失敗');
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var passEdit = this.state.pass.length > 0 || this.state.passCollation.length > 0 ? false : true;
      return React.createElement(
        'div',
        null,
        React.createElement(
          FormGroup,
          { color: this.state.idColor },
          React.createElement(
            Label,
            null,
            React.createElement(
              'h4',
              null,
              '\u30E6\u30FC\u30B6\u30FCID',
              React.createElement(
                Button,
                { color: 'primary', size: 'sm', onClick: this.onClickCheckId },
                '\u4F7F\u7528\u53EF\u80FD\u304B\u30C1\u30A7\u30C3\u30AF'
              )
            )
          ),
          React.createElement(Input, { type: 'text', state: this.state.idColor, placeholder: '\u30E6\u30FC\u30B6\u30FC\u540D', value: this.state.id, onChange: this.handleChangeId }),
          React.createElement(IdErrorMessage, { color: this.state.idColor })
        ),
        React.createElement(
          FormGroup,
          { color: this.state.nameColor },
          React.createElement(
            Label,
            null,
            React.createElement(
              'h4',
              null,
              '\u540D\u524D'
            )
          ),
          React.createElement(Input, { type: 'text', state: this.state.nameColor, placeholder: '\u540D\u524D', value: this.state.name, onChange: this.handleChangeName })
        ),
        React.createElement(
          FormGroup,
          { color: this.state.passColor },
          React.createElement(
            Label,
            null,
            React.createElement(
              'h4',
              null,
              '\u30D1\u30B9\u30EF\u30FC\u30C9'
            )
          ),
          React.createElement(Input, { type: 'password', state: this.state.passColor, placeholder: '\u30D1\u30B9\u30EF\u30FC\u30C9', value: this.state.pass, onChange: this.handleChangePass }),
          React.createElement(PassErrorMessage, { color: this.state.passColor })
        ),
        React.createElement(
          FormGroup,
          { color: this.state.passColor },
          React.createElement(
            Label,
            null,
            React.createElement(
              'h4',
              null,
              '\u30D1\u30B9\u30EF\u30FC\u30C9\u518D\u5165\u529B'
            )
          ),
          React.createElement(Input, { type: 'password', state: this.state.passColor, placeholder: '\u30D1\u30B9\u30EF\u30FC\u30C9\u518D\u5165\u529B', value: this.state.passCollation, onChange: this.handleChangePassCollation }),
          React.createElement(PassErrorMessage, { color: this.state.passColor })
        ),
        React.createElement(
          FormGroup,
          { color: this.state.teamColor },
          React.createElement(
            Label,
            null,
            React.createElement(
              'h4',
              null,
              '\u6240\u5C5E\u30C1\u30FC\u30E0'
            )
          ),
          React.createElement(ListTeam, { teams: this.state.teams, color: this.state.teamColor, onEventCallBack: this.handleChangeTeam })
        ),
        React.createElement(
          FormGroup,
          { color: this.state.carColor },
          React.createElement(
            Label,
            null,
            React.createElement(
              'h4',
              null,
              '\u8ECA\u306E\u5B9A\u54E1'
            )
          ),
          React.createElement(
            Input,
            { type: 'select', color: this.state.carColor, onChange: this.handleChangeCar },
            React.createElement(
              'option',
              { value: '0' },
              '\u8ECA\u306E\u5B9A\u54E1\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044'
            ),
            React.createElement(
              'option',
              { value: '2' },
              '2'
            ),
            React.createElement(
              'option',
              { value: '3' },
              '3'
            ),
            React.createElement(
              'option',
              { value: '4' },
              '4'
            ),
            React.createElement(
              'option',
              { value: '5' },
              '5'
            ),
            React.createElement(
              'option',
              { value: '6' },
              '6'
            ),
            React.createElement(
              'option',
              { value: '7' },
              '7'
            ),
            React.createElement(
              'option',
              { value: '8' },
              '8'
            ),
            React.createElement(
              'option',
              { value: '9' },
              '9'
            )
          )
        ),
        React.createElement(
          Button,
          { color: 'primary', size: 'lg', block: true, onClick: this.onClickSubmit },
          '\u767B\u9332'
        )
      );
    }
  }]);

  return Register;
}(React.Component);

ReactDOM.render(React.createElement(Register, null), document.getElementById('register'));