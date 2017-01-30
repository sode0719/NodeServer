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

const ListScore = (props) => {
  const list = props.list.map(function(s, i) {
    function onClickDelete() {
      $.ajax({
        url: 'http://172.16.1.12:3000/api/score/' + s._id,
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
        <td><a href={'/score/' + s._id} style={styles.a}>{s.date}</a></td>
        <td><a href={'/score/' + s._id} style={styles.a}>{s.gameName}</a></td>
        <td><a href={'/score/' + s._id} style={styles.a}>{s.venue}</a></td>
        <td><Button color="primary" size="sm" onClick={onClickDelete}>削除</Button></td>
      </tr>
    );
  });

  return (
      <tbody>
        {list}
      </tbody>
  );
};

class Score extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team_id: $('#js-team_id').text(),
      list: [],
    };
  }

  componentDidMount() {
    $.ajax({
      url: 'http://172.16.1.12:3000/api/score/team/' + this.state.team_id,
      type: 'GET',
      dataType: 'json',
    }).then(
        function(json) {
          this.setState({list: json});
        }.bind(this),
        function() {
          console.log('読み込み失敗');
        }
      );
  }

  render() {
    return (
      <div>
        <Table hover>
          <thead>
            <tr>
              <th>日付</th>
              <th>試合名</th>
              <th>会場</th>
              <th>編集</th>
            </tr>
          </thead>
          <ListScore list={this.state.list} />
        </Table>
      </div>
    );
  }
}

ReactDOM.render(
  <Score />,
  document.getElementById('score-list')
);
