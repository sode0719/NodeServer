'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Reactstrap = Reactstrap;
var Button = _Reactstrap.Button;
var Row = _Reactstrap.Row;
var Col = _Reactstrap.Col;


var Status = function Status(props) {
  var style = {
    inline: { display: 'flex' },
    list: { padding: '0 15px 0 15px' }
  };

  return React.createElement(
    Row,
    { style: style.inline },
    React.createElement(
      'h4',
      { style: style.list },
      '\u96C6\u5408\u5834\u6240\uFF1A',
      props.data.aggregate
    ),
    React.createElement(
      'h4',
      { style: style.list },
      '\u76EE\u7684\u5730\uFF1A',
      props.data.destination
    ),
    React.createElement(
      'h4',
      { style: style.list },
      '\u65E5\u4ED8\uFF1A',
      props.data.date ? props.data.date.split('T')[0] : ''
    ),
    React.createElement(
      'h4',
      { style: style.list },
      '\u8FD4\u4FE1\uFF1A',
      props.reply,
      ' / ',
      props.data.send
    )
  );
};

var Person = function Person(props) {
  if (props.is) {
    return null;
  }

  var c = '';
  if (props.operator) {
    c = 'js-operator';
  }
  return React.createElement(
    'li',
    { className: 'list-group-item ' + c, 'data-id': props._id },
    props.name
  );
};

var ListPerson = function ListPerson(props) {
  var list = props.person.map(function (p, i) {
    return React.createElement(Person, _extends({}, p, { key: i }));
  });

  return React.createElement(
    'div',
    null,
    React.createElement(
      'ul',
      { className: 'sortable' },
      React.createElement(
        'li',
        { className: 'list-group-item list-group-item-info sortable-stop sortable-disable' },
        '\u4E00\u89A7'
      ),
      list
    )
  );
};

var Car = function Car(props) {
  return React.createElement(
    'ul',
    { className: 'list-group sortable js-car', 'data-owner': props.owner },
    React.createElement(
      'li',
      { className: 'list-group-item list-group-item-info sortable-stop sortable-disable', 'data-capacity': props.capacity },
      props.operator,
      ' \u3055\u3093\u306E\u8ECA ',
      React.createElement(
        'span',
        { className: 'tag tag-default tag-pill pull-right js-capacity' },
        '0/',
        props.capacity
      )
    )
  );
};

var ListCar = function ListCar(props) {
  var list = props.cars.map(function (car, i) {
    return React.createElement(
      Col,
      { xs: '4', className: 'js-list-dispatcher', key: i },
      React.createElement(Car, { operator: car.name, capacity: car.capacity, owner: car.owner_id })
    );
  });

  return React.createElement(
    Row,
    { className: 'js-list' },
    list
  );
};

var ListDirect = function ListDirect(props) {
  var list = props.direct.map(function (p, i) {
    return React.createElement(Person, _extends({}, p, { key: i }));
  });

  return React.createElement(
    'div',
    null,
    React.createElement(
      'ul',
      null,
      React.createElement(
        'li',
        { className: 'list-group-item list-group-item-warning sortable-stop sortable-disable' },
        '\u4E0D\u8981'
      ),
      list
    )
  );
};

var Dispatcher = function (_React$Component) {
  _inherits(Dispatcher, _React$Component);

  function Dispatcher(props) {
    _classCallCheck(this, Dispatcher);

    var _this = _possibleConstructorReturn(this, (Dispatcher.__proto__ || Object.getPrototypeOf(Dispatcher)).call(this, props));

    _this.state = {
      id: $('#js-id').text(),
      data: [],
      reply: 0,
      gPerson: [],
      gCars: [],
      rPerson: [],
      rCars: [],
      direct: [],
      isDivide: false
    };

    _this.onClickSubmit = _this.onClickSubmit.bind(_this);
    return _this;
  }

  _createClass(Dispatcher, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      $.ajax({
        url: 'http://localhost:3000/api/dispatcher/' + this.state.id,
        type: 'GET',
        dataType: 'json'
      }).then(function (json) {
        var data = json[0];
        var isDivide = false;
        if (data.divide.length !== 0) {
          data.divide = JSON.parse(data.divide);
          isDivide = true;
        }
        this.setState({
          data: data,
          isDivide: isDivide
        });

        $.ajax({
          url: 'http://localhost:3000/api/dispatcher/id/' + this.state.id,
          type: 'GET',
          dataType: 'json'
        }).then(function (json) {
          var _this2 = this;

          var gPerson = [];
          var gCars = [];
          var rPerson = [];
          var rCars = [];
          var direct = [];
          var count = json.length;
          json.forEach(function (user) {
            var data = {
              _id: user.user_id,
              name: user.name,
              operator: user.operator,
              status: user.status,
              is: false
            };
            // 往復
            if (user.confirm && user.status === 0) {
              gPerson.push(clone(data));
              rPerson.push(clone(data));
            } else if (user.confirm && user.status === 1) {
              gPerson.push(clone(data));
            } else if (user.confirm && user.status === 2) {
              rPerson.push(clone(data));
            } else if (user.confirm && user.status === 3) {
              direct.push(clone(data));
            }

            var car = {
              owner_id: user.user_id,
              name: user.name,
              capacity: user.capacity,
              status: user.status
            };

            // 不要以外の車
            if (user.car === 0) {
              rCars.push(clone(car));
              gCars.push(clone(car));
            } else if (user.car === 1) {
              gCars.push(clone(car));
            } else if (user.car === 2) {
              rCars.push(clone(car));
            }

            // 子供取得
            for (var i = 0; i < user.children.length; i++) {
              var child = {
                _id: user.children[i]._id,
                name: user.children[i].name,
                status: user.children[i].status,
                operator: false,
                is: false
              };

              if (user.children[i].confirm && user.children[i].status === 0) {
                gPerson.push(clone(child));
                rPerson.push(clone(child));
              } else if (user.children[i].confirm && user.children[i].status === 1) {
                gPerson.push(clone(child));
              } else if (user.children[i].confirm && user.children[i].status === 2) {
                rPerson.push(clone(child));
              } else if (user.children[i].confirm && user.children[i].status === 3) {
                direct.push(clone(child));
              }
            }
          });

          this.setState({
            gPerson: gPerson,
            rPerson: rPerson,
            gCars: gCars,
            rCars: rCars,
            direct: direct,
            reply: count
          }, function () {
            if (_this2.state.isDivide) {
              (function () {
                var data = _this2.state.data.divide;
                // 行き
                var gList = _this2.state.gPerson;
                data.going.forEach(function (p) {
                  var owner_id = p.owner_id;
                  p.divide.forEach(function (d) {
                    var html = '';
                    if (d.operator) {
                      html = '<li class="list-group-item js-operator" data-id="' + d._id + '">' + d.name + '</li>';
                    } else {
                      html = '<li class="list-group-item" data-id="' + d._id + '">' + d.name + '</li>';
                    }

                    $('.js-going').find('.js-car[data-owner="' + owner_id + '"]').append(html);

                    gList.forEach(function (p, i) {
                      if (p._id === d._id) {
                        gList[i].is = true;
                      }
                    });
                  });
                });

                // 帰り
                var rList = _this2.state.rPerson;
                data.return.forEach(function (p) {
                  var owner_id = p.owner_id;
                  p.divide.forEach(function (d) {
                    var html = '';
                    if (d.operator) {
                      html = '<li class="list-group-item js-operator" data-id="' + d._id + '">' + d.name + '</li>';
                    } else {
                      html = '<li class="list-group-item" data-id="' + d._id + '">' + d.name + '</li>';
                    }

                    $('.js-return').find('.js-car[data-owner="' + owner_id + '"]').append(html);

                    rList.forEach(function (p, i) {
                      if (p._id === d._id) {
                        rList[i].is = true;
                      }
                    });
                  });
                });

                _this2.setState({
                  gPerson: gList,
                  rPerson: rList
                });

                getDispatcher();
              })();
            }
          });
        }.bind(this), function () {
          console.log('読み込み失敗');
        });
      }.bind(this), function () {
        console.log('読み込み失敗');
      });

      function clone(obj) {
        var newObj = {};
        for (var key in obj) {
          newObj[key] = obj[key];
        }

        return newObj;
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      $(function () {
        $('.sortable').sortable({
          items: 'li:not(.sortable-disable)',
          connectWith: '.sortable',
          cancel: '.sortable-stop',
          update: function update(ev, ui) {
            getDispatcher();
          }
        });
        $('.sortable').disableSelection();
      });
    }
  }, {
    key: 'onClickSubmit',
    value: function onClickSubmit() {
      // エラーがある場合は決定させない
      if ($('.js-list-dispatcher').find('.list-group-item-danger').length !== 0) {
        return false;
      }

      var dispatcher = {
        going: [],
        return: []
      };

      $('.js-list').each(function (i) {
        var temp = [];
        $(this).find('.js-list-dispatcher').each(function (i) {
          $(this).children().each(function () {
            var divide = [];
            var capacity = 0;
            var owner = '';
            var length = $(this).find('.list-group-item').length;
            $(this).find('.list-group-item').each(function (j) {
              if (j !== 0) {
                var name = $(this).text();
                var id = $(this).attr('data-id');
                var operator = false;
                if ($(this).hasClass('js-operator')) {
                  operator = true;
                }
                var person = {
                  _id: id,
                  name: name,
                  operator: operator
                };

                divide.push(person);
              } else if (j === 0) {
                var count = $(this).text().split('/');
                capacity = count[count.length - 1];
                owner = $(this).parent().attr('data-owner');
              }
            });

            temp.push({
              owner_id: owner,
              capacity: capacity,
              divide: divide
            });
          });
        });

        if (i === 0) {
          dispatcher.going = temp;
        } else {
          dispatcher.return = temp;
        }
      });

      $.ajax({
        url: 'http://localhost:3000/api/dispatcher/' + this.state.id,
        type: 'PUT',
        dataType: 'json',
        data: { divide: JSON.stringify(dispatcher) }
      }).then(function (json) {
        alert('保存しました。');
      }, function () {
        console.log('読み込み失敗');
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var style = { button: { margin: '0' } };
      return React.createElement(
        'div',
        null,
        React.createElement(Status, { data: this.state.data, reply: this.state.reply }),
        React.createElement(
          Row,
          { id: 'js-buffer' },
          React.createElement(
            'ul',
            { className: 'nav nav-tabs', role: 'tablist' },
            React.createElement(
              'li',
              { className: 'nav-item' },
              React.createElement(
                'a',
                { className: 'nav-link active', 'data-toggle': 'tab', href: '#going', role: 'tab' },
                '\u884C\u304D'
              )
            ),
            React.createElement(
              'li',
              { className: 'nav-item' },
              React.createElement(
                'a',
                { className: 'nav-link', 'data-toggle': 'tab', href: '#return', role: 'tab' },
                '\u5E30\u308A'
              )
            ),
            React.createElement(
              'li',
              null,
              React.createElement(
                Button,
                { color: 'primary', onClick: this.onClickSubmit, className: 'pull-right', style: style.button },
                '\u6C7A\u5B9A'
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'tab-content' },
            React.createElement(
              'div',
              { className: 'tab-pane active', id: 'going', role: 'tabpanel' },
              React.createElement(
                Row,
                null,
                React.createElement(
                  Col,
                  { xs: '3' },
                  React.createElement(ListPerson, { person: this.state.gPerson }),
                  React.createElement(ListDirect, { direct: this.state.direct })
                ),
                React.createElement(
                  Col,
                  { xs: '9', className: 'js-going' },
                  React.createElement(ListCar, { cars: this.state.gCars })
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'tab-pane', id: 'return', role: 'tabpanel' },
              React.createElement(
                Row,
                null,
                React.createElement(
                  Col,
                  { xs: '3' },
                  React.createElement(ListPerson, { person: this.state.rPerson }),
                  React.createElement(ListDirect, { direct: this.state.direct })
                ),
                React.createElement(
                  Col,
                  { xs: '9', className: 'js-return' },
                  React.createElement(ListCar, { cars: this.state.rCars })
                )
              )
            )
          )
        )
      );
    }
  }]);

  return Dispatcher;
}(React.Component);

ReactDOM.render(React.createElement(Dispatcher, null), document.getElementById('dispatcher'));

function getDispatcher() {
  $('.js-car').each(function () {
    var capacity = Number($(this).children('li').attr('data-capacity'));
    var count = -1;
    var operator = false;
    $(this).children('li').each(function (i) {
      if ($(this).hasClass('js-operator')) {
        operator = true;
      }
      count++;
    });

    $(this).find('.js-capacity').text(count + '/' + capacity);

    if (count < capacity && operator || count === 0) {
      $(this).find('.js-capacity').parent().addClass('list-group-item-info');
      $(this).find('.js-capacity').parent().removeClass('list-group-item-success list-group-item-danger');
    } else if (count === capacity && operator) {
      $(this).find('.js-capacity').parent().addClass('list-group-item-success');
      $(this).find('.js-capacity').parent().removeClass('list-group-item-info list-group-item-danger');
    } else if (count > capacity || !operator) {
      $(this).find('.js-capacity').parent().addClass('list-group-item-danger');
      $(this).find('.js-capacity').parent().removeClass('list-group-item-info list-group-item-success');
    }
  });
}