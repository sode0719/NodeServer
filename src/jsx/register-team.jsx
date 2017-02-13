'use strict';

const {
  Button,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  InputGroup,
  InputGroupButton,
} = Reactstrap;

const PassErrorMessage = (props) => {
  if(props.color === '' || props.color === 'success') {
    return <FormFeedback>英数字8文字以上</FormFeedback>;
  } else if(props.color === 'danger') {
    return <FormFeedback>文字数が足りないかパスワードが一致しません</FormFeedback>;
  }
};

const IdErrorMessage = (props) => {
  if(props.color === 'danger') {
    return <FormFeedback>入力したIDは既に使用されています</FormFeedback>;
  } else if(props.color === '') {
    return null;
  } else if(props.color === 'success') {
    return <FormFeedback>入力したIDは使用可能です</FormFeedback>;
  } else if(props.color === 'warning') {
    return <FormFeedback>使用可能かチェックしてください</FormFeedback>;
  }
};

const BasketNumberErrorMessage = (props) => {
  if(props.color === '' || props.color === 'success') {
    return <FormFeedback>新規登録可能です</FormFeedback>;
  } else if(props.color === 'danger') {
    return <FormFeedback>該当のチームは既に登録されています</FormFeedback>;
  } else if(props.color === 'warning') {
    return <FormFeedback>11桁入力してください</FormFeedback>;
  }
};

const TeamErrorMessage = (props) => {
  if(props.color === '' || props.color === 'success') {
    return null;
  } else if(props.color === 'warning') {
    return <FormFeedback>入力してください</FormFeedback>;
  }
};

class RegisterTeam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      teamhomeColor: '',
    };

    // handle
    this.handleChangeId = this.handleChangeId.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangePass = this.handleChangePass.bind(this);
    this.handleChangePassCollation = this.handleChangePassCollation.bind(this);
    this.handleChangeTeam = this.handleChangeTeam.bind(this);
    this.handleChangeTeamHome = this.handleChangeTeamHome.bind(this);
    this.handleChangeBasketNumber = this.handleChangeBasketNumber.bind(this);
    this.handleChangeCar = this.handleChangeCar.bind(this);
    // onClick
    this.onClickCheckId = this.onClickCheckId.bind(this);
    this.onClickSubmit = this.onClickSubmit.bind(this);
  }

  componentDidMount() {

  }

  //--------------------------------------------------
  // handleChange
  //--------------------------------------------------

  handleChangeId(event) {
    this.setState({
      id: event.target.value,
      idColor: 'warning',
    });
  }

  handleChangeName(event) {
    this.setState({name: event.target.value}, () => {
      if(this.state.name !== '') {
        this.state.nameColor = 'success';
      } else {
        this.state.nameColor = 'warning';
      }
    });
  }

  handleChangePass(event) {
    this.setState({pass: event.target.value}, () => {
      this.isMatch();
    });
  }

  handleChangePassCollation(event) {
    this.setState({passCollation: event.target.value}, () => {
      this.isMatch();
    });
  }

  handleChangeBasketNumber(event) {
    if(event.target.value.length > 11) {
      return false;
    }

    this.setState({
      basketNumber: event.target.value,
    });

    if(event.target.value.length === 11) {
      $.ajax({
        url: 'http://172.16.1.12:3000/api/team/basketnumber/' +  event.target.value,
        type: 'GET',
        dataType: 'json',
      }).then(
          function(json) {
            if(json.length === 0) {
              this.setState({
                basketColor: 'success',
              });
            } else {
              this.setState({
                basketColor: 'danger',
              });
            }
          }.bind(this),
          function() {
            console.log('読み込み失敗');
          }
        );
    } else {
      this.setState({
        basketColor: 'warning',
      });
    }
  }

  handleChangeTeam(event) {
    this.setState({
      team: event.target.value,
    }, () => {
      if(this.state.team !== '') {
        this.setState({
          teamColor: 'success',
        });
      } else {
        this.setState({
          teamColor: 'warning',
        });
      }
    });
  }

  handleChangeTeamHome(event) {
    this.setState({
      teamhome: event.target.value,
    }, () => {
      if(this.state.teamhome !== '') {
        this.setState({
          teamhomeColor: 'success',
        });
      } else {
        this.setState({
          teamhomeColor: 'warning',
        });
      }
    });
  }

  handleChangeCar(event) {
    if(event.value === '車の定員を選択してください') {
      this.setState({
        car: '',
        carColor: 'warning',
      });
    } else {
      this.setState({
        car: event.target.value,
        carColor: 'success',
      });
    }
  }

  //--------------------------------------------------
  // onClick
  //--------------------------------------------------
  onClickCheckId() {
    if(this.state.id !== '') {
      this.findUserId(this.state.id);
    }
  }

  onClickSubmit() {
    let result = true;
    if(this.state.idColor !== 'success') {
      result = false;
    }
    if(this.state.nameColor !== 'success') {
      result = false;
    }
    if(this.state.passColor !== 'success') {
      result = false;
    }
    if(this.state.teamColor !== 'success') {
      result = false;
    }
    if(this.state.carColor !== 'success') {
      result = false;
    }

    if(this.state.basketColor !== 'success') {
      result = false;
    }

    if(this.state.teamhomeColor !== 'success') {
      result = false;
    }

    console.log(result);

    if(result) {
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
          teamhome: this.state.teamhome,
        },
      }).then(
          function(json) {
            console.log(json);
            if(json.success) {
              alert('登録しました');
            }
          },
          function() {
            console.log('読み込み失敗');
          });
    }
  }

  //--------------------------------------------------
  // method
  //--------------------------------------------------
  isMatch() {
    if(this.state.pass === this.state.passCollation && (this.state.pass.length >= 8 || this.state.passCollation.length >= 8)) {
      this.setState({passColor: 'success'});
    } else {
      this.setState({passColor: 'danger'});
    }
  }

  findUserId(id) {
    $.ajax({
      url: 'http://172.16.1.12:3000/api/user/check/' + id,
      type: 'GET',
      dataType: 'json',
    }).then(
        function(json) {
          if(json.find) {
            this.setState({idColor: 'danger'});
          } else {
            this.setState({idColor: 'success'});
          }
        }.bind(this),
        function() {
          console.log('読み込み失敗');
        });
  }

  render() {
    const passEdit = this.state.pass.length > 0 || this.state.passCollation.length > 0 ? false : true;
    return (
      <div style={{marginBottom: '25px'}}>
        <h2>チーム情報</h2>
        <FormGroup color={this.state.basketColor}>
          <Label><h4>番号</h4></Label>
          <Input type="number" state={this.state.basketColor} placeholder="番号" value={this.state.basketNumber} onChange={this.handleChangeBasketNumber} />
          <BasketNumberErrorMessage color={this.state.basketColor} />
        </FormGroup>
        <FormGroup color={this.state.teamColor}>
          <Label><h4>チーム名</h4></Label>
          <Input type="text" state={this.state.teamColor} placeholder="チーム名" value={this.state.team} onChange={this.handleChangeTeam} />
          <TeamErrorMessage color={this.state.teamColor} />
        </FormGroup>
        <FormGroup color={this.state.teamhomeColor}>
          <Label><h4>ホームグラウンド</h4></Label>
          <Input type="text" state={this.state.teamhomeColor} placeholder="ホームグラウンド" value={this.state.teamhome} onChange={this.handleChangeTeamHome} />
          <TeamErrorMessage color={this.state.teamhomeColor} />
        </FormGroup>
        <hr />
        <h2>代表者アカウント</h2>
        <FormGroup color={this.state.idColor}>
          <Label><h4>ユーザーID<Button color="primary" size="sm" onClick={this.onClickCheckId}>使用可能かチェック</Button></h4></Label>
          <Input type="text" state={this.state.idColor} placeholder="ユーザー名" value={this.state.id} onChange={this.handleChangeId} />
          <IdErrorMessage color={this.state.idColor} />
        </FormGroup>
        <FormGroup color={this.state.nameColor}>
          <Label><h4>名前</h4></Label>
          <Input type="text" state={this.state.nameColor} placeholder="名前" value={this.state.name} onChange={this.handleChangeName} />
        </FormGroup>
        <FormGroup color={this.state.passColor}>
          <Label><h4>パスワード</h4></Label>
          <Input type="password" state={this.state.passColor} placeholder="パスワード" value={this.state.pass} onChange={this.handleChangePass} />
          <PassErrorMessage color={this.state.passColor} />
        </FormGroup>
        <FormGroup color={this.state.passColor}>
          <Label><h4>パスワード再入力</h4></Label>
          <Input type="password" state={this.state.passColor} placeholder="パスワード再入力" value={this.state.passCollation} onChange={this.handleChangePassCollation} />
          <PassErrorMessage color={this.state.passColor} />
        </FormGroup>
        <FormGroup color={this.state.carColor}>
          <Label><h4>車の定員</h4></Label>
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
        </FormGroup>
        <Button color="primary" size="lg" block onClick={this.onClickSubmit}>登録</Button>
      </div>
    );
  }
}

ReactDOM.render(
  <RegisterTeam />,
  document.getElementById('register')
);
