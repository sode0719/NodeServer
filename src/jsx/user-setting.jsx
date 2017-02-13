'use strict';

const {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  InputGroup,
  InputGroupButton,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} = Reactstrap;

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      car: '',
      carCapacity: [],
      carColor: '',
      children: [],
      removeChildren: [],
    };

    // handle
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeCar = this.handleChangeCar.bind(this);
    // onClick
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.onClickAdd = this.onClickAdd.bind(this);

    this.onChangeChild = this.onChangeChild.bind(this);
    this.onClickChildAdd = this.onClickChildAdd.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: 'http://172.16.1.12:3000/api/user/obj/' +  $('#js-id').text(),
      type: 'GET',
      dataType: 'json',
    }).then(
        function(json) {
          const data = json[0];

          this.setState({
            name: data.name,
            carCapacity: data.carCapacity,
          });
        }.bind(this),
        function() {
          console.log('読み込み失敗');
        }
      );

    $.ajax({
      url: 'http://172.16.1.12:3000/api/user/children/' +  $('#js-id').text(),
      type: 'GET',
      dataType: 'json',
    }).then(
        function(json) {
          this.setState({
            children: json,
          });
        }.bind(this),
        function() {
          console.log('読み込み失敗');
        }
      );
  }

  //--------------------------------------------------
  // handleChange
  //--------------------------------------------------
  handleChangeName(event) {
    this.setState({name: event.target.value}, () => {
      if(this.state.name !== '') {
        this.state.nameColor = 'success';
      } else {
        this.state.nameColor = 'warning';
      }
    });
  }

  handleChangeCar(event) {
    if(event.value === '車の定員を選択してください') {
      this.setState({
        car: '',
      });
    } else {
      this.setState({
        car: event.target.value,
      });
    }
  }

  //--------------------------------------------------
  // onClick
  //--------------------------------------------------
  onClickSubmit() {
    let result = true;
    if(this.state.name === '') {
      result = false;
    }

    const children = this.state.children.filter((c) => {
      return c.name !== '';
    });

    if(result) {
      let data = {};
      if(this.state.removeChildren.length > 0) {
        data = {
          name: this.state.name,
          carCapacity: JSON.stringify(this.state.carCapacity),
          children: JSON.stringify(children),
          removeChildren: JSON.stringify(this.state.removeChildren),
        };
      } else {
        data = {
          name: this.state.name,
          carCapacity: JSON.stringify(this.state.carCapacity),
          children: JSON.stringify(children),
        };
      }

      $.ajax({
        url: 'http://172.16.1.12:3000/api/user/' +  $('#js-id').text(),
        type: 'PUT',
        dataType: 'json',
        data: data,
      }).then(
          function(json) {
            console.log(json);
            if(json.success) {
              alert('更新しました');
              location.reload();
            }
          },
          function() {
            console.log('読み込み失敗');
          });
    }
  }

  onClickAdd() {
    if(this.state.car === '') {
      return false;
    }

    this.setState({
      carCapacity: this.state.carCapacity.concat(Number(this.state.car)),
    });
  }

  onClickDel(num) {
    if(this.state.carCapacity.length === 1) {
      alert('削除できません');
      return false;
    }

    const temp = this.state.carCapacity;
    temp.splice(num, 1);
    this.setState({
      carCapacity: temp,
    });
  }

  onChangeChild(data) {
    if(data.type === 'change') {
      const children = this.state.children.map((c) => {
        if(c._id === data.id) {
          c.name = data.name;
        }
        return c;
      });

      this.setState({
        children: children,
      });
    } else if(data.type === 'delete') {
      const children = this.state.children.filter((c) => {
        return c._id !== data.id;
      });

      const remove = this.state.children.filter((c) => {
        return c._id.length === 24 && c._id === data.id;
      });

      this.setState({
        children: children,
        removeChildren: this.state.removeChildren.concat(remove),
      });
    }
  }

  onClickChildAdd() {
    this.setState({
      children: this.state.children.concat({
        _id: Math.random().toString(34).slice(2),
        name: '',
      }),
    });
  }

  render() {
    const childList = this.state.children.map((c, i) => {
      return (
        <li style={{paddingLeft: '15px'}} key={i}>
          <Child {...c} onCallBack={this.onChangeChild}/>
        </li>
      );
    });

    const carList = this.state.carCapacity.map((c, i) => {
      return (
        <div key={i} style={{marginTop: '10px'}}>
          <Row>
            <Col sm={10}>
              <h3 className="text-sm-center">{i + 1} - {c} 人乗り</h3>
            </Col>
            <Col sm={2}>
              <Button color="danger" onClick={this.onClickDel.bind(this, i)}><i className="fa fa-minus" aria-hidden="true"></i></Button>
            </Col>
          </Row>
        </div>
      );
    });

    return (
      <div style={{marginBottom: '25px'}}>
        <FormGroup color={this.state.nameColor}>
          <Label><h4>名前</h4></Label>
          <Input type="text" placeholder="名前" value={this.state.name} onChange={this.handleChangeName} />
        </FormGroup>
        <hr />
        <Row>
          <Col sm={10}>
            <h2 style={{paddingTop: '6px', paddingBottom: '15px'}}>団員</h2>
          </Col>
          <Col sm={2}>
            <Button color="success" onClick={this.onClickChildAdd}><i className="fa fa-plus" aria-hidden="true"></i></Button>
          </Col>
        </Row>
        <ul>
          {childList}
        </ul>
        <hr />
        <FormGroup color={this.state.carColor}>
          <Label><h4>車の定員</h4></Label>
          {carList}
          <hr />
          <Row style={{ marginTop: '10px' }}>
            <Col sm={7}>
              <Input type="select" color={this.state.carColor} onChange={this.handleChangeCar}>
                <option value="0">車の定員を選択してください</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
              </Input>
            </Col>
            <Col sm={5}>
              <Button color="info" size="lg" onClick={this.onClickAdd} block>追加</Button>
            </Col>
          </Row>
        </FormGroup>
        <Button color="primary" size="lg" style={{marginBottom: '70px'}} onClick={this.onClickSubmit} block>更新</Button>
        <ModalDelete />
      </div>
    );
  }
}

class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameColor: '',
    };

    this.onChangeChild = this.onChangeChild.bind(this);
    this.onDeleteChild = this.onDeleteChild.bind(this);
  }

  onChangeChild(id, e) {
    this.props.onCallBack({
      id: id,
      name: e.target.value,
      type: 'change',
    });
  }

  onDeleteChild(id, e) {
    this.props.onCallBack({
      id: id,
      name: e.target.value,
      type: 'delete',
    });
  }

  render() {
    return (
      <div>
        <FormGroup color={this.state.nameColor}>
          <Label><h4>団員名</h4></Label>
          <Row>
          <Col sm={10}>
            <Input type="text" placeholder="名前" value={this.props.name} onChange={this.onChangeChild.bind(this, this.props._id)} />
          </Col>
          <Col sm={2}>
            <Button color="danger" onClick={this.onDeleteChild.bind(this, this.props._id)}><i className="fa fa-minus" aria-hidden="true"></i></Button>
          </Col>
          </Row>
        </FormGroup>
      </div>
    );
  }
}

class ModalDelete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };

    this.toggle = this.toggle.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  onClickDelete() {
    $.ajax({
      url: 'http://172.16.1.12:3000/api/user/' +  $('#js-id').text(),
      type: 'DELETE',
      dataType: 'json',
    }).then(
        function(json) {
          console.log(json);
          if(json.success) {
            alert('削除しました');
            location.href = '/logout/redirect';
          }
        },
        function() {
          console.log('読み込み失敗');
        });
    this.toggle();
  }

  render() {
    return (
      <div>
        <Button color="danger" onClick={this.toggle} block>アカウント削除</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className + ' modal-sm'}>
          <ModalHeader toggle={this.toggle}>確認</ModalHeader>
          <ModalBody>
            アカウントを削除しますか？
          </ModalBody>
          <ModalFooter>
            <Button color="blue-grey" className="pull-left" onClick={this.toggle}>キャンセル</Button>
            <Button color="danger" onClick={this.onClickDelete}>削除</Button>{' '}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

ReactDOM.render(
  <Register />,
  document.getElementById('setting')
);
