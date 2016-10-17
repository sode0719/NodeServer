console.log("Server Starting...");
// =======================
// モジュール
// =======================
var express    = require('express');
var app        = express();
var session    = require('express-session')
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var jwt        = require('jsonwebtoken');
var path       = require('path');

var config     = require('./config');
var User       = require('./app/models/user');
var Schedule   = require('./app/models/schedule')

// =======================
// コンソールカラー
// =======================
var black   = '\u001b[30m';
var red     = '\u001b[31m';
var green   = '\u001b[32m';
var yellow  = '\u001b[33m';
var blue    = '\u001b[34m';
var magenta = '\u001b[35m';
var cyan    = '\u001b[36m';
var white   = '\u001b[37m';

var reset   = '\u001b[0m';

//console.log(red + 'This text is red. ' + green + 'Greeeeeeen!' + reset);

// =======================
// コンフィグ
// =======================
// データベース接続
mongoose.connect(config.database, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});

app.set('superSecret', config.secret);

//viewsの設定
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

// config for body-parser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// リクエストログ
app.use(morgan('dev'));

//公開ディレクトリ設定
app.use(express.static('public'));

//セッションの設定 maxAge nullでセッションクッキー
app.use(session({
    secret: 'token',
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: null
    }
}));


// =======================
// ルーティング
// =======================
var index = require('./app/routes/index');
app.use('/', index);
var setup = require('./app/routes/setup');
app.use('/setup', setup);
var setup = require('./app/routes/login');
app.use('/login', setup);
var setup = require('./app/routes/logout');
app.use('/logout', setup);
var setup = require('./app/routes/calendar');
app.use('/calendar', setup);

// =======================
// APIルーティング
// =======================
var apiRoutes = express.Router();
// 認証不要 api --------
// POST(http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

  // find db by posted name
  User.findOne({
    id: req.body.id
  }, function(err, user) {
    if (err) throw err;

    // validation
    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
      return;
    }

    if (user.password != req.body.password) {
      res.json({
        success: false,
        message: 'Authentication failed. Wrong password.'
      });
      return;
    }

    // when valid -> create token
    var token = jwt.sign(user, app.get('superSecret'), {
      expiresIn: '24h'
    });

    //TODO
    req.session.token = token;
    req.session.save();

    res.json({
      success: true,
      message: 'Authentication successfully finished.',
      token: token
    });

  });

});

// これ以降のルーティングは認証が必要
apiRoutes.use(function(req, res, next) {

  // get token from body:token or query:token of Http Header:x-access-token
  // var token = req.body.token || req.query.token || req.headers['x-access-token'];
  var token = req.session.token;

  // validate token
  if (!token) {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }

  jwt.verify(token, app.get('superSecret'), function(err, decoded) {
    if (err) {
      return res.json({
        success: false,
        message: 'Invalid token'
      });
    }

    // if token valid -> save token to request for use in other routes
    req.decoded = decoded;
    next();

  });

});

// 認証必要 api --------
// GET(http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to API routing'});
});

// GET(http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    if (err) throw err;
    res.json(users);
  });
});

apiRoutes.get('/schedule', function(req, res) {
  Schedule.find({}, function(err, schedules) {
    if (err) throw err;
    res.json(schedules);
  });
});

apiRoutes.post('/schedule', function(req, res) {
  var schedule = new Schedule({
    team_id: "null",
    title: req.body.title,
    start: req.body.start,
    end: req.body.end
  });

  schedule.save({}, function(err) {
    if (err) throw err;
    res.json({success: true});
  });
});

apiRoutes.delete('/schedule', function(req, res) {
  Schedule.remove({_id: req.body._id}, function(err) {
    if (err) throw err;
    res.json({success: true});
  });
});

apiRoutes.put('/schedule', function(req, res) {
  Schedule.findOne({ _id: req.body._id }, function (err, doc){
    doc.team_id = "";
    doc.title = req.body.title;
    doc.start = req.body.start;
    doc.end = req.body.end;
    doc.save({}, function(err) {
      if (err) throw err;
      res.json({success: true});
    });
  });
});

apiRoutes.get('/logout', function(req, res) {
  req.session.destroy();
  res.json({ message: 'Logout'});
});

app.use('/api', apiRoutes);

module.exports = app;
