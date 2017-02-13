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
var Modal = _Reactstrap.Modal;
var ModalHeader = _Reactstrap.ModalHeader;
var ModalBody = _Reactstrap.ModalBody;
var ModalFooter = _Reactstrap.ModalFooter;

var Register = function (_React$Component) {
  _inherits(Register, _React$Component);

  function Register(props) {
    _classCallCheck(this, Register);

    var _this = _possibleConstructorReturn(this, (Register.__proto__ || Object.getPrototypeOf(Register)).call(this, props));

    _this.state = {
      name: '',
      car: '',
      carCapacity: [],
      carColor: '',
      children: [],
      removeChildren: []
    };

    // handle
    _this.handleChangeName = _this.handleChangeName.bind(_this);
    _this.handleChangeCar = _this.handleChangeCar.bind(_this);
    // onClick
    _this.onClickSubmit = _this.onClickSubmit.bind(_this);
    _this.onClickAdd = _this.onClickAdd.bind(_this);

    _this.onChangeChild = _this.onChangeChild.bind(_this);
    _this.onClickChildAdd = _this.onClickChildAdd.bind(_this);
    return _this;
  }

  _createClass(Register, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      $.ajax({
        url: 'http://172.16.1.12:3000/api/user/obj/' + $('#js-id').text(),
        type: 'GET',
        dataType: 'json'
      }).then(function (json) {
        var data = json[0];

        this.setState({
          name: data.name,
          carCapacity: data.carCapacity
        });
      }.bind(this), function () {
        console.log('読み込み失敗');
      });

      $.ajax({
        url: 'http://172.16.1.12:3000/api/user/children/' + $('#js-id').text(),
        type: 'GET',
        dataType: 'json'
      }).then(function (json) {
        this.setState({
          children: json
        });
      }.bind(this), function () {
        console.log('読み込み失敗');
      });
    }

    //--------------------------------------------------
    // handleChange
    //--------------------------------------------------

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
    key: 'handleChangeCar',
    value: function handleChangeCar(event) {
      if (event.value === '車の定員を選択してください') {
        this.setState({
          car: ''
        });
      } else {
        this.setState({
          car: event.target.value
        });
      }
    }

    //--------------------------------------------------
    // onClick
    //--------------------------------------------------

  }, {
    key: 'onClickSubmit',
    value: function onClickSubmit() {
      var result = true;
      if (this.state.name === '') {
        result = false;
      }

      var children = this.state.children.filter(function (c) {
        return c.name !== '';
      });

      if (result) {
        var data = {};
        if (this.state.removeChildren.length > 0) {
          data = {
            name: this.state.name,
            carCapacity: JSON.stringify(this.state.carCapacity),
            children: JSON.stringify(children),
            removeChildren: JSON.stringify(this.state.removeChildren)
          };
        } else {
          data = {
            name: this.state.name,
            carCapacity: JSON.stringify(this.state.carCapacity),
            children: JSON.stringify(children)
          };
        }

        $.ajax({
          url: 'http://172.16.1.12:3000/api/user/' + $('#js-id').text(),
          type: 'PUT',
          dataType: 'json',
          data: data
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
    key: 'onClickAdd',
    value: function onClickAdd() {
      if (this.state.car === '') {
        return false;
      }

      this.setState({
        carCapacity: this.state.carCapacity.concat(Number(this.state.car))
      });
    }
  }, {
    key: 'onClickDel',
    value: function onClickDel(num) {
      if (this.state.carCapacity.length === 1) {
        alert('削除できません');
        return false;
      }

      var temp = this.state.carCapacity;
      temp.splice(num, 1);
      this.setState({
        carCapacity: temp
      });
    }
  }, {
    key: 'onChangeChild',
    value: function onChangeChild(data) {
      if (data.type === 'change') {
        var children = this.state.children.map(function (c) {
          if (c._id === data.id) {
            c.name = data.name;
          }
          return c;
        });

        this.setState({
          children: children
        });
      } else if (data.type === 'delete') {
        var _children = this.state.children.filter(function (c) {
          return c._id !== data.id;
        });

        var remove = this.state.children.filter(function (c) {
          return c._id.length === 24 && c._id === data.id;
        });

        this.setState({
          children: _children,
          removeChildren: this.state.removeChildren.concat(remove)
        });
      }
    }
  }, {
    key: 'onClickChildAdd',
    value: function onClickChildAdd() {
      this.setState({
        children: this.state.children.concat({
          _id: Math.random().toString(34).slice(2),
          name: ''
        })
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var childList = this.state.children.map(function (c, i) {
        return React.createElement(
          'li',
          { style: { paddingLeft: '15px' }, key: i },
          React.createElement(Child, _extends({}, c, { onCallBack: _this3.onChangeChild }))
        );
      });

      var carList = this.state.carCapacity.map(function (c, i) {
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
                c,
                ' \u4EBA\u4E57\u308A'
              )
            ),
            React.createElement(
              Col,
              { sm: 2 },
              React.createElement(
                Button,
                { color: 'danger', onClick: _this3.onClickDel.bind(_this3, i) },
                React.createElement('i', { className: 'fa fa-minus', 'aria-hidden': 'true' })
              )
            )
          )
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
              '\u540D\u524D'
            )
          ),
          React.createElement(Input, { type: 'text', placeholder: '\u540D\u524D', value: this.state.name, onChange: this.handleChangeName })
        ),
        React.createElement('hr', null),
        React.createElement(
          Row,
          null,
          React.createElement(
            Col,
            { sm: 10 },
            React.createElement(
              'h2',
              { style: { paddingTop: '6px', paddingBottom: '15px' } },
              '\u56E3\u54E1'
            )
          ),
          React.createElement(
            Col,
            { sm: 2 },
            React.createElement(
              Button,
              { color: 'success', onClick: this.onClickChildAdd },
              React.createElement('i', { className: 'fa fa-plus', 'aria-hidden': 'true' })
            )
          )
        ),
        React.createElement(
          'ul',
          null,
          childList
        ),
        React.createElement('hr', null),
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
          carList,
          React.createElement('hr', null),
          React.createElement(
            Row,
            { style: { marginTop: '10px' } },
            React.createElement(
              Col,
              { sm: 7 },
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
        React.createElement(
          Button,
          { color: 'primary', size: 'lg', style: { marginBottom: '70px' }, onClick: this.onClickSubmit, block: true },
          '\u66F4\u65B0'
        ),
        React.createElement(ModalDelete, null)
      );
    }
  }]);

  return Register;
}(React.Component);

var Child = function (_React$Component2) {
  _inherits(Child, _React$Component2);

  function Child(props) {
    _classCallCheck(this, Child);

    var _this4 = _possibleConstructorReturn(this, (Child.__proto__ || Object.getPrototypeOf(Child)).call(this, props));

    _this4.state = {
      nameColor: ''
    };

    _this4.onChangeChild = _this4.onChangeChild.bind(_this4);
    _this4.onDeleteChild = _this4.onDeleteChild.bind(_this4);
    return _this4;
  }

  _createClass(Child, [{
    key: 'onChangeChild',
    value: function onChangeChild(id, e) {
      this.props.onCallBack({
        id: id,
        name: e.target.value,
        type: 'change'
      });
    }
  }, {
    key: 'onDeleteChild',
    value: function onDeleteChild(id, e) {
      this.props.onCallBack({
        id: id,
        name: e.target.value,
        type: 'delete'
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          FormGroup,
          { color: this.state.nameColor },
          React.createElement(
            Label,
            null,
            React.createElement(
              'h4',
              null,
              '\u56E3\u54E1\u540D'
            )
          ),
          React.createElement(
            Row,
            null,
            React.createElement(
              Col,
              { sm: 10 },
              React.createElement(Input, { type: 'text', placeholder: '\u540D\u524D', value: this.props.name, onChange: this.onChangeChild.bind(this, this.props._id) })
            ),
            React.createElement(
              Col,
              { sm: 2 },
              React.createElement(
                Button,
                { color: 'danger', onClick: this.onDeleteChild.bind(this, this.props._id) },
                React.createElement('i', { className: 'fa fa-minus', 'aria-hidden': 'true' })
              )
            )
          )
        )
      );
    }
  }]);

  return Child;
}(React.Component);

var ModalDelete = function (_React$Component3) {
  _inherits(ModalDelete, _React$Component3);

  function ModalDelete(props) {
    _classCallCheck(this, ModalDelete);

    var _this5 = _possibleConstructorReturn(this, (ModalDelete.__proto__ || Object.getPrototypeOf(ModalDelete)).call(this, props));

    _this5.state = {
      modal: false
    };

    _this5.toggle = _this5.toggle.bind(_this5);
    _this5.onClickDelete = _this5.onClickDelete.bind(_this5);
    return _this5;
  }

  _createClass(ModalDelete, [{
    key: 'toggle',
    value: function toggle() {
      this.setState({
        modal: !this.state.modal
      });
    }
  }, {
    key: 'onClickDelete',
    value: function onClickDelete() {
      $.ajax({
        url: 'http://172.16.1.12:3000/api/user/' + $('#js-id').text(),
        type: 'DELETE',
        dataType: 'json'
      }).then(function (json) {
        console.log(json);
        if (json.success) {
          alert('削除しました');
          location.href = '/logout/redirect';
        }
      }, function () {
        console.log('読み込み失敗');
      });
      this.toggle();
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          Button,
          { color: 'danger', onClick: this.toggle, block: true },
          '\u30A2\u30AB\u30A6\u30F3\u30C8\u524A\u9664'
        ),
        React.createElement(
          Modal,
          { isOpen: this.state.modal, toggle: this.toggle, className: this.props.className + ' modal-sm' },
          React.createElement(
            ModalHeader,
            { toggle: this.toggle },
            '\u78BA\u8A8D'
          ),
          React.createElement(
            ModalBody,
            null,
            '\u30A2\u30AB\u30A6\u30F3\u30C8\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F'
          ),
          React.createElement(
            ModalFooter,
            null,
            React.createElement(
              Button,
              { color: 'blue-grey', className: 'pull-left', onClick: this.toggle },
              '\u30AD\u30E3\u30F3\u30BB\u30EB'
            ),
            React.createElement(
              Button,
              { color: 'danger', onClick: this.onClickDelete },
              '\u524A\u9664'
            ),
            ' '
          )
        )
      );
    }
  }]);

  return ModalDelete;
}(React.Component);

ReactDOM.render(React.createElement(Register, null), document.getElementById('setting'));