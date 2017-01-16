'use strict';

const {
  Button,
  Row,
  Col,
} = Reactstrap;

const Status = (props) => {
  const style = {
    inline: {display: 'flex'},
    list: {padding: '0 15px 0 15px'},
  };

  return (
    <Row style={style.inline}>
      <h4 style={style.list}>集合場所：{props.data.aggregate}</h4>
      <h4 style={style.list}>目的地：{props.data.destination}</h4>
      <h4 style={style.list}>日付：{props.data.date ? props.data.date.split('T')[0] : ''}</h4>
      <h4 style={style.list}>返信：{props.reply} / {props.data.send}</h4>
    </Row>
  );
};

const Person = (props) => {
  if(props.is) {
    return null;
  }

  let c = '';
  if(props.operator) {
    c = 'js-operator';
  }
  return (
    <li className={'list-group-item ' + c} data-id={props._id}>{props.name}</li>
  );
};

const ListPerson = (props) => {
  const list = props.person.map(function(p, i) {
    return (
      <Person {...p} key={i} />
    );
  });

  return (
    <div>
      <ul className="sortable">
        <li className="list-group-item list-group-item-info sortable-stop sortable-disable">一覧</li>
        {list}
      </ul>
    </div>
  );
};

const Car = (props) => {
  return (
    <ul className="list-group sortable js-car" data-owner={props.owner}>
      <li className="list-group-item list-group-item-info sortable-stop sortable-disable" data-capacity={props.capacity}>{props.operator} さんの車 <span className="tag tag-default tag-pill pull-right js-capacity">0/{props.capacity}</span></li>
    </ul>
  );
};

const ListCar = (props) => {
  const list = props.cars.map(function(car, i) {
    return (
      <Col xs="4" className="js-list-dispatcher" key={i}>
        <Car operator={car.name} capacity={car.capacity} owner={car.owner_id} />
      </Col>
    );
  });

  return (
      <Row className="js-list">
        {list}
      </Row>
  );
};

const ListDirect = (props) => {
  const list = props.direct.map(function(p, i) {
    return (
      <Person {...p} key={i} />
    );
  });

  return (
    <div>
      <ul>
        <li className="list-group-item list-group-item-warning sortable-stop sortable-disable">不要</li>
        {list}
      </ul>
    </div>
  );
};

class Dispatcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: $('#js-id').text(),
      data: [],
      reply: 0,
      gPerson: [],
      gCars: [],
      rPerson: [],
      rCars: [],
      direct: [],
      isDivide: false,
    };

    this.onClickSubmit = this.onClickSubmit.bind(this);
  }

  componentWillMount() {
    $.ajax({
      url: 'http://localhost:3000/api/dispatcher/' + this.state.id,
      type: 'GET',
      dataType: 'json',
    }).then(
        function(json) {
          const data = json[0];
          let isDivide = false;
          if(data.divide.length !== 0) {
            data.divide = JSON.parse(data.divide);
            isDivide = true;
          }
          this.setState({
            data: data,
            isDivide: isDivide,
          });

          $.ajax({
            url: 'http://localhost:3000/api/dispatcher/id/' + this.state.id,
            type: 'GET',
            dataType: 'json',
          }).then(
              function(json) {
                const gPerson = [];
                const gCars = [];
                const rPerson = [];
                const rCars = [];
                const direct = [];
                const count = json.length;
                json.forEach(function(user) {
                  const data = {
                    _id: user.user_id,
                    name: user.name,
                    operator: user.operator,
                    status: user.status,
                    is: false,
                  };
                  // 往復
                  if(user.confirm && user.status === 0) {
                    gPerson.push(clone(data));
                    rPerson.push(clone(data));
                  } else if(user.confirm && user.status === 1) {
                    gPerson.push(clone(data));
                  } else if(user.confirm && user.status === 2) {
                    rPerson.push(clone(data));
                  } else if(user.confirm && user.status === 3) {
                    direct.push(clone(data));
                  }

                  const car = {
                    owner_id: user.user_id,
                    name: user.name,
                    capacity: user.capacity,
                    status: user.status,
                  };

                  // 不要以外の車
                  if(user.car === 0) {
                    rCars.push(clone(car));
                    gCars.push(clone(car));
                  } else if(user.car === 1) {
                    gCars.push(clone(car));
                  } else if(user.car === 2) {
                    rCars.push(clone(car));
                  }

                  // 子供取得
                  for(let i = 0; i < user.children.length; i++) {
                    const child = {
                      _id: user.children[i]._id,
                      name: user.children[i].name,
                      status: user.children[i].status,
                      operator: false,
                      is: false,
                    };

                    if(user.children[i].confirm && user.children[i].status === 0) {
                      gPerson.push(clone(child));
                      rPerson.push(clone(child));
                    } else if(user.children[i].confirm && user.children[i].status === 1) {
                      gPerson.push(clone(child));
                    } else if(user.children[i].confirm && user.children[i].status === 2) {
                      rPerson.push(clone(child));
                    } else if(user.children[i].confirm && user.children[i].status === 3) {
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
                  reply: count,
                }, () => {
                  if(this.state.isDivide) {
                    const data = this.state.data.divide;
                    // 行き
                    const gList = this.state.gPerson;
                    data.going.forEach((p) => {
                      const owner_id = p.owner_id;
                      p.divide.forEach((d) => {
                        let html = '';
                        if(d.operator) {
                          html = '<li class="list-group-item js-operator" data-id="' + d._id + '">' + d.name + '</li>';
                        } else {
                          html = '<li class="list-group-item" data-id="' + d._id + '">' + d.name + '</li>';
                        }

                        $('.js-going').find('.js-car[data-owner="' + owner_id + '"]').append(html);

                        gList.forEach((p, i) => {
                          if(p._id === d._id) {
                            gList[i].is = true;
                          }
                        });
                      });
                    });

                    // 帰り
                    const rList = this.state.rPerson;
                    data.return.forEach((p) => {
                      const owner_id = p.owner_id;
                      p.divide.forEach((d) => {
                        let html = '';
                        if(d.operator) {
                          html = '<li class="list-group-item js-operator" data-id="' + d._id + '">' + d.name + '</li>';
                        } else {
                          html = '<li class="list-group-item" data-id="' + d._id + '">' + d.name + '</li>';
                        }

                        $('.js-return').find('.js-car[data-owner="' + owner_id + '"]').append(html);

                        rList.forEach((p, i) => {
                          if(p._id === d._id) {
                            rList[i].is = true;
                          }
                        });
                      });
                    });

                    this.setState({
                      gPerson: gList,
                      rPerson: rList,
                    });

                    getDispatcher();
                  }
                });
              }.bind(this),
              function() {
                console.log('読み込み失敗');
              }
            );
        }.bind(this),
        function() {
          console.log('読み込み失敗');
        }
      );

    function clone(obj) {
      const newObj = {};
      for(const key in obj) {
        newObj[key] = obj[key];
      }

      return newObj;
    }
  }

  componentDidUpdate() {
    $(function() {
      $('.sortable').sortable({
        items: 'li:not(.sortable-disable)',
        connectWith: '.sortable',
        cancel: '.sortable-stop',
        update: function(ev, ui) {
          getDispatcher();
        },
      });
      $('.sortable').disableSelection();
    });
  }

  onClickSubmit() {
    // エラーがある場合は決定させない
    if($('.js-list-dispatcher').find('.list-group-item-danger').length !== 0) {
      return false;
    }

    const dispatcher = {
      going: [],
      return: [],
    };

    $('.js-list').each(function(i) {
      const temp = [];
      $(this).find('.js-list-dispatcher').each(function(i) {
        $(this).children().each(function() {
          const divide = [];
          let capacity = 0;
          let owner = '';
          const length = $(this).find('.list-group-item').length;
          $(this).find('.list-group-item').each(function(j) {
            if(j !== 0) {
              const name = $(this).text();
              const id = $(this).attr('data-id');
              let operator = false;
              if($(this).hasClass('js-operator')) {
                operator = true;
              }
              const person = {
                _id: id,
                name: name,
                operator: operator,
              };

              divide.push(person);
            } else if(j === 0) {
              const count = $(this).text().split('/');
              capacity = count[count.length - 1];
              owner = $(this).parent().attr('data-owner');
            }
          });

          temp.push({
            owner_id: owner,
            capacity: capacity,
            divide: divide,
          });
        });
      });

      if(i === 0) {
        dispatcher.going = temp;
      } else {
        dispatcher.return = temp;
      }
    });

    $.ajax({
      url: 'http://localhost:3000/api/dispatcher/' + this.state.id,
      type: 'PUT',
      dataType: 'json',
      data: {divide: JSON.stringify(dispatcher)},
    }).then(
        function(json) {
          alert('保存しました。');
        },
        function() {
          console.log('読み込み失敗');
        }
      );
  }

  render() {
    const style = {button: {margin: '0'}};
    return (
      <div>
        <Status data={this.state.data} reply={this.state.reply} />
        <Row id="js-buffer">
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item">
              <a className="nav-link active" data-toggle="tab" href="#going" role="tab">行き</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-toggle="tab" href="#return" role="tab">帰り</a>
            </li>
            <li>
              <Button color="primary" onClick={this.onClickSubmit} className="pull-right" style={style.button}>決定</Button>
            </li>
          </ul>

          <div className="tab-content">
            <div className="tab-pane active" id="going" role="tabpanel">
              <Row>
                <Col xs="3">
                  <ListPerson person={this.state.gPerson} />
                  <ListDirect direct={this.state.direct} />
                </Col>
                <Col xs="9" className="js-going">
                  <ListCar cars={this.state.gCars} />
                </Col>
              </Row>
            </div>
            <div className="tab-pane" id="return" role="tabpanel">
              <Row>
                <Col xs="3">
                  <ListPerson person={this.state.rPerson} />
                  <ListDirect direct={this.state.direct} />
                </Col>
                <Col xs="9" className="js-return">
                  <ListCar cars={this.state.rCars} />
                </Col>
              </Row>
            </div>
          </div>
        </Row>
      </div>
    );
  }
}

ReactDOM.render(
  <Dispatcher />,
  document.getElementById('dispatcher')
);

function getDispatcher() {
  $('.js-car').each(function() {
    const capacity = Number($(this).children('li').attr('data-capacity'));
    let count = -1;
    let operator = false;
    $(this).children('li').each(function(i) {
      if($(this).hasClass('js-operator')) {
        operator = true;
      }
      count++;
    });

    $(this).find('.js-capacity').text(count + '/' + capacity);

    if((count < capacity && operator) || count === 0) {
      $(this).find('.js-capacity').parent().addClass('list-group-item-info');
      $(this).find('.js-capacity').parent().removeClass('list-group-item-success list-group-item-danger');
    } else if(count === capacity && operator) {
      $(this).find('.js-capacity').parent().addClass('list-group-item-success');
      $(this).find('.js-capacity').parent().removeClass('list-group-item-info list-group-item-danger');
    } else if(count > capacity || !operator) {
      $(this).find('.js-capacity').parent().addClass('list-group-item-danger');
      $(this).find('.js-capacity').parent().removeClass('list-group-item-info list-group-item-success');
    }
  });
}
