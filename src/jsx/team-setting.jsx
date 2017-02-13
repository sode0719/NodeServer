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
} = Reactstrap;

class TeamSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      nameColor: 'success',
      home: [],
      hometext: '',
      users: [],
    };

    this.onChangeName = this.onChangeName.bind(this);
    this.onClickAdd = this.onClickAdd.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onChangeHomeText = this.onChangeHomeText.bind(this);
    this.onClickSubmit = this.onClickSubmit.bind(this);

    this.onChangeDelegate = this.onChangeDelegate.bind(this);
  }
  componentDidMount() {
    $.ajax({
      url: 'http://172.16.1.12:3000/api/team/' +  $('#js-id').text(),
      type: 'GET',
      dataType: 'json',
    }).then(
        function(json) {
          const data = json[0];
          this.setState({
            name: data.name,
            home: data.home,
          });
        }.bind(this),
        function() {
          console.log('読み込み失敗');
        }
      );

    $.ajax({
      url: 'http://172.16.1.12:3000/api/team/user/' +  $('#js-id').text(),
      type: 'GET',
      dataType: 'json',
    }).then(
        function(json) {
          this.setState({
            users: json,
          });
        }.bind(this),
        function() {
          console.log('読み込み失敗');
        }
      );
  }

  onClickDelete(num) {
    if(this.state.home.length === 1) {
      alert('削除できません');
      return false;
    }
    const temp = this.state.home;
    temp.splice(num, 1);
    this.setState({
      home: temp,
    });
  }

  onChangeHomeText(e) {
    this.setState({
      hometext: e.target.value,
    });
  }

  onClickAdd() {
    if(this.state.hometext === '') {
      return false;
    }

    this.setState({
      home: this.state.home.concat(this.state.hometext),
      hometext: '',
    });
  }

  onChangeName(e) {
    if(e.target.value === '') {
      this.setState({
        nameColor: 'danger',
      });
    } else {
      this.setState({
        nameColor: 'success',
      });
    }

    this.setState({
      name: e.target.value,
    });
  }

  onClickSubmit() {
    let result = true;
    if(this.state.name === '') {
      result = false;
    }

    if(result) {
      $.ajax({
        url: 'http://172.16.1.12:3000/api/team/' +  $('#js-id').text(),
        type: 'PUT',
        dataType: 'json',
        data: {
          name: this.state.name,
          home: JSON.stringify(this.state.home),
          users: JSON.stringify(this.state.users),
        },
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

  onChangeDelegate(data) {
    const temp = this.state.users.map((user) => {
      const u = clone(user);
      if(data.id === u._id) {
        u.delegate = data.delegate;
      }

      return u;
    });

    const count = temp.map((user) => {
      return user.delegate;
    });

    if(!count.includes(true)) {
      alert('チームに代表者は一人以上必要です');
    } else {
      this.setState({
        users: temp,
      });
    }

    function clone(obj) {
      const newObj = {};
      for(const key in obj) {
        newObj[key] = obj[key];
      }

      return newObj;
    }
  }

  render() {
    const homeList = this.state.home.map((data, i) => {
      return (
        <div key={i} style={{marginTop: '10px'}}>
          <Row>
            <Col sm={10}>
              <h3 className="text-sm-center">{i + 1} - {data}</h3>
            </Col>
            <Col sm={2}>
              <Button color="danger" onClick={this.onClickDelete.bind(this, i)}><i className="fa fa-minus" aria-hidden="true"></i></Button>
            </Col>
          </Row>
        </div>
      );
    });

    const userList = this.state.users.map((u, i) => {
      return (
        <div style={{paddingLeft: '15px'}} key={i}>
          <User {...u} onCallBack={this.onChangeDelegate}/>
        </div>
      );
    });
    return (
      <div style={{marginBottom: '25px'}}>
        <FormGroup color={this.state.nameColor}>
          <Label><h4>チーム名</h4></Label>
          <Input type="text" placeholder="チーム名" value={this.state.name} state={this.state.nameColor} onChange={this.onChangeName} />
        </FormGroup>
        <hr />
        <FormGroup>
          <Label><h4>ホームグラウンド</h4></Label>
          {homeList}
          <Row style={{ marginTop: '10px' }}>
            <Col sm={7}>
              <Input type="text" placeholder="新しいホームグラウンド" value={this.state.hometext} onChange={this.onChangeHomeText} />
            </Col>
            <Col sm={5}>
              <Button color="info" size="lg" onClick={this.onClickAdd} block>追加</Button>
            </Col>
          </Row>
        </FormGroup>
        <hr />
        <h4 style={{paddingBottom: '15px'}}>パーミッション</h4>
        <div>
          {userList}
        </div>
        <hr />
        <Button color="primary" size="lg" block onClick={this.onClickSubmit}>更新</Button>
      </div>
    );
  }
}

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.onClickDelegate = this.onClickDelegate.bind(this);
  }

  onClickDelegate(id, e) {
    this.props.onCallBack({
      id: this.props._id,
      delegate: !this.props.delegate,
    });
  }

  render() {
    return (
      <Row style={{marginBottom: '15px'}}>
        <Col sm={9}>
          <h4>{this.props.name}</h4>
        </Col>
        <Col sm={3}>
          <Button color={this.props.delegate ? 'orange' : 'blue-grey'} onClick={this.onClickDelegate} block>{this.props.delegate ? '代表' : '一般'}</Button>
        </Col>
      </Row>
    );
  }
}

ReactDOM.render(
  <TeamSetting />,
  document.getElementById('setting')
);
