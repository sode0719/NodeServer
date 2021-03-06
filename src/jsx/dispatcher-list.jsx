'use strict';

const {
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} = Reactstrap;

const Complete = (props) => {
  if(props.length !== 0) {
    return (
      <i className="fa fa-check" aria-hidden="true"></i>
    );
  }

  return null;
};

const ListDispatcher = (props) => {
  const list = props.list.map(function(d, i) {
    function onClickDelete() {
      $.ajax({
        url: 'http://172.16.1.12:3000/api/dispatcher/' + d._id,
        type: 'DELETE',
        dataType: 'json',
      }).then(
          function(json) {
            window.location.reload();
          }.bind(this),
          function() {
            console.log('読み込み失敗');
          }
        );
    }

    const styles = {
      a: {
        display: 'block',
        height: '100%',
        width: '100%',
      },
    };

    return (
      <tr key={i}>
        <td><a href={'/dispatcher/' + d._id} style={styles.a}>{d.title}</a></td>
        <td><a href={'/dispatcher/' + d._id} style={styles.a}>{d.date.split('T')[0]}</a></td>
        <td><a href={'/dispatcher/' + d._id} style={styles.a}>{d.aggregate}</a></td>
        <td><a href={'/dispatcher/' + d._id} style={styles.a}>{d.destination}</a></td>
        <td><Complete length={d.divide.length} /></td>
      </tr>
    );
    // <td><Button color="primary" size="sm" onClick={onClickDelete}>削除</Button></td>
  });

  return (
      <tbody>
        {list}
      </tbody>
  );
};

class Dispatcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team_id: $('#js-team_id').text(),
      dispatcherList: [],
    };
  }

  componentDidMount() {
    const d = new Date();
    const m = Number(d.getMonth() + 1);
    const month = m  < 10 ? '0' + m : m;
    const date = d.getFullYear() + '-' + month + '-' + d.getDate();
    $.ajax({
      url: 'http://172.16.1.12:3000/api/dispatcher/team/' + this.state.team_id,
      type: 'GET',
      dataType: 'json',
      data: {date: date},
    }).then(
        function(json) {
          const data = json.filter((data) => {
            return data.isUse === true;
          });

           // 日付が早い順に並び替え
          data.sort(function(a, b) {
            const aa = Number(a.date.split('T')[0].replace(/-/g, ''));
            const bb = Number(b.date.split('T')[0].replace(/-/g, ''));
            return aa > bb ? 1 : -1;
          });

          this.setState({
            dispatcherList: data,
          });
        }.bind(this),
        function() {
          console.log('読み込み失敗');
        }
      );
  }

  render() {
    if(this.state.dispatcherList.length === 0) {
      return (
        <div className="alert alert-info" >
          配車の予定が登録されていません
        </div>
      );
    } else {
      return (
        <div>
          <ModalAdd teamId={this.state.team_id}/>
          <Table hover>
            <thead>
              <tr>
                <th>タイトル</th>
                <th>日付</th>
                <th>集合場所</th>
                <th>目的地</th>
                <th>配車完了</th>
              </tr>
            </thead>
            <ListDispatcher list={this.state.dispatcherList} />
          </Table>
        </div>
      );
    }
  }
}

class ModalAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      team_id: this.props.teamId,
      title: '',
      date: new Date(),
      aggregate: '',
      destination: '',
    };

    this.toggle = this.toggle.bind(this);

    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeAggregate = this.handleChangeAggregate.bind(this);
    this.handleChangeDestination = this.handleChangeDestination.bind(this);

    this.onClickSubmit = this.onClickSubmit.bind(this);
  }

  componentDidUpdate() {
    // デイトピッカーの設定
    $('.datepicker').datepicker({
      format: 'yyyy-mm-dd',
      language: 'ja',
      autoclose: true,
    });
    $('.datepicker').datepicker('setDate', this.state.date);
  }

  toggle() {
    this.setState({modal: !this.state.modal});
  }

  handleChangeTitle(event) {
    this.setState({title: event.target.value});
  }

  handleChangeAggregate(event) {
    this.setState({aggregate: event.target.value});
  }

  handleChangeDestination(event) {
    this.setState({destination: event.target.value});
  }

  onClickSubmit() {
    this.toggle();
    this.setState({date: $('.datepicker').val()}, () => {
      console.log(this.state);
      $.ajax({
        url: 'http://172.16.1.12:3000/api/dispatcher/',
        type: 'POST',
        dataType: 'json',
        data: {
          team_id: this.state.team_id,
          title: this.state.title,
          date: this.state.date,
          aggregate: this.state.aggregate,
          destination: this.state.destination,
        },
      }).then(
          function(json) {
            console.log(json);
            window.location.reload();
          }.bind(this),
          function() {
            console.log('読み込み失敗');
          }
        );
    });
  }

  render() {
    return (
      <div>
        <Button color="primary" onClick={this.toggle} style={{display: 'none'}}>新規登録</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>新規配車登録</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label><h4>タイトル</h4></Label>
              <Input type="text" placeholder="タイトル" onChange={this.handleChangeTitle} />
            </FormGroup>
            <div className="form-group">
              <label><h4>日付</h4></label>
              <input type="text" className="form-control datepicker" placeholder="日付" readOnly />
            </div>
            <FormGroup>
              <Label><h4>集合場所</h4></Label>
              <Input type="text" placeholder="集合場所" onChange={this.handleChangeAggregate} />
            </FormGroup>
            <FormGroup>
              <Label><h4>目的地</h4></Label>
              <Input type="text" placeholder="目的地" onChange={this.handleChangeDestination} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button className="pull-left" color="blue-grey" onClick={this.toggle}>キャンセル</Button>
            <Button color="primary" onClick={this.onClickSubmit}>登録</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

ReactDOM.render(
  <Dispatcher />,
  document.getElementById('dispatcher-list')
);
