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

var BasketNumberErrorMessage = function BasketNumberErrorMessage(props) {
  if (props.color === '' || props.color === 'success') {
    return React.createElement(
      FormFeedback,
      null,
      '\u65B0\u898F\u767B\u9332\u53EF\u80FD\u3067\u3059'
    );
  } else if (props.color === 'danger') {
    return React.createElement(
      FormFeedback,
      null,
      '\u8A72\u5F53\u306E\u30C1\u30FC\u30E0\u306F\u65E2\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059'
    );
  } else if (props.color === 'warning') {
    return React.createElement(
      FormFeedback,
      null,
      '11\u6841\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044'
    );
  }
};

var TeamErrorMessage = function TeamErrorMessage(props) {
  if (props.color === '' || props.color === 'success') {
    return null;
  } else if (props.color === 'warning') {
    return React.createElement(
      FormFeedback,
      null,
      '\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044'
    );
  }
};

var RegisterTeam = function (_React$Component) {
  _inherits(RegisterTeam, _React$Component);

  function RegisterTeam(props) {
    _classCallCheck(this, RegisterTeam);

    var _this = _possibleConstructorReturn(this, (RegisterTeam.__proto__ || Object.getPrototypeOf(RegisterTeam)).call(this, props));

    _this.state = {
      id: '',
      idUsed: false,
      idColor: '',
      name: '',
      nameColor: '',
      pass: '',
      passCollation: '',
      passColor: '',
      team: '',
      teamColor: '',
      car: '',
      carColor: 'warning',
      basketNumber: '',
      basketColor: 'warning',
      teamhome: '',
      teamhomeColor: ''
    };

    // handle
    _this.handleChangeId = _this.handleChangeId.bind(_this);
    _this.handleChangeName = _this.handleChangeName.bind(_this);
    _this.handleChangePass = _this.handleChangePass.bind(_this);
    _this.handleChangePassCollation = _this.handleChangePassCollation.bind(_this);
    _this.handleChangeTeam = _this.handleChangeTeam.bind(_this);
    _this.handleChangeTeamHome = _this.handleChangeTeamHome.bind(_this);
    _this.handleChangeBasketNumber = _this.handleChangeBasketNumber.bind(_this);
    _this.handleChangeCar = _this.handleChangeCar.bind(_this);
    // onClick
    _this.onClickCheckId = _this.onClickCheckId.bind(_this);
    _this.onClickSubmit = _this.onClickSubmit.bind(_this);
    return _this;
  }

  _createClass(RegisterTeam, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}

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
    key: 'handleChangeBasketNumber',
    value: function handleChangeBasketNumber(event) {
      if (event.target.value.length > 11) {
        return false;
      }

      this.setState({
        basketNumber: event.target.value
      });

      if (event.target.value.length === 11) {
        $.ajax({
          url: 'http://172.16.1.12:3000/api/team/basketnumber/' + event.target.value,
          type: 'GET',
          dataType: 'json'
        }).then(function (json) {
          if (json.length === 0) {
            this.setState({
              basketColor: 'success'
            });
          } else {
            this.setState({
              basketColor: 'danger'
            });
          }
        }.bind(this), function () {
          console.log('読み込み失敗');
        });
      } else {
        this.setState({
          basketColor: 'warning'
        });
      }
    }
  }, {
    key: 'handleChangeTeam',
    value: function handleChangeTeam(event) {
      var _this5 = this;

      this.setState({
        team: event.target.value
      }, function () {
        if (_this5.state.team !== '') {
          _this5.setState({
            teamColor: 'success'
          });
        } else {
          _this5.setState({
            teamColor: 'warning'
          });
        }
      });
    }
  }, {
    key: 'handleChangeTeamHome',
    value: function handleChangeTeamHome(event) {
      var _this6 = this;

      this.setState({
        teamhome: event.target.value
      }, function () {
        if (_this6.state.teamhome !== '') {
          _this6.setState({
            teamhomeColor: 'success'
          });
        } else {
          _this6.setState({
            teamhomeColor: 'warning'
          });
        }
      });
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
      if (this.state.nameColor !== 'success') {
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

      if (this.state.basketColor !== 'success') {
        result = false;
      }

      if (this.state.teamhomeColor !== 'success') {
        result = false;
      }

      console.log(result);

      if (result) {
        $.ajax({
          url: 'http://172.16.1.12:3000/api/user/team',
          type: 'POST',
          dataType: 'json',
          data: {
            user_id: this.state.id,
            name: this.state.name,
            password: this.state.pass,
            team: this.state.team,
            car: this.state.car,
            basketNumber: this.state.basketNumber,
            teamhome: this.state.teamhome
          }
        }).then(function (json) {
          console.log(json);
          if (json.success) {
            alert('登録しました');
          }
        }, function () {
          console.log('読み込み失敗');
        });
      }
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
        { style: { marginBottom: '25px' } },
        React.createElement(
          'h2',
          null,
          '\u30C1\u30FC\u30E0\u60C5\u5831'
        ),
        React.createElement(
          FormGroup,
          { color: this.state.basketColor },
          React.createElement(
            Label,
            null,
            React.createElement(
              'h4',
              null,
              '\u756A\u53F7'
            )
          ),
          React.createElement(Input, { type: 'number', state: this.state.basketColor, placeholder: '\u756A\u53F7', value: this.state.basketNumber, onChange: this.handleChangeBasketNumber }),
          React.createElement(BasketNumberErrorMessage, { color: this.state.basketColor })
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
              '\u30C1\u30FC\u30E0\u540D'
            )
          ),
          React.createElement(Input, { type: 'text', state: this.state.teamColor, placeholder: '\u30C1\u30FC\u30E0\u540D', value: this.state.team, onChange: this.handleChangeTeam }),
          React.createElement(TeamErrorMessage, { color: this.state.teamColor })
        ),
        React.createElement(
          FormGroup,
          { color: this.state.teamhomeColor },
          React.createElement(
            Label,
            null,
            React.createElement(
              'h4',
              null,
              '\u30DB\u30FC\u30E0\u30B0\u30E9\u30A6\u30F3\u30C9'
            )
          ),
          React.createElement(Input, { type: 'text', state: this.state.teamhomeColor, placeholder: '\u30DB\u30FC\u30E0\u30B0\u30E9\u30A6\u30F3\u30C9', value: this.state.teamhome, onChange: this.handleChangeTeamHome }),
          React.createElement(TeamErrorMessage, { color: this.state.teamhomeColor })
        ),
        React.createElement('hr', null),
        React.createElement(
          'h2',
          null,
          '\u4EE3\u8868\u8005\u30A2\u30AB\u30A6\u30F3\u30C8'
        ),
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

  return RegisterTeam;
}(React.Component);

ReactDOM.render(React.createElement(RegisterTeam, null), document.getElementById('register'));