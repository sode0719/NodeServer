//--------------------------------------------------
// モジュール
//--------------------------------------------------
const express = require('express');
const app        = express();
const session    = require('express-session');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const mongoose   = require('mongoose');
const jwt        = require('jsonwebtoken');
const path       = require('path');

// MongoDB
const config     = require('./config');
const User       = require('./app/models/user');
const Schedule   = require('./app/models/schedule');

const log = require('./logger');

log.info('Server Starting...');
//--------------------------------------------------
// コンフィグ
//--------------------------------------------------
// データベース接続
mongoose.connect(config.database, function(err) {
  if (err) {
    log.failure('Connection to MongoDB');
    throw err;
  }
  log.success('Connection to MongoDB');
});

app.set('superSecret', config.secret);

// viewsの設定
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

// config for body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// リクエストログ
app.use(morgan('dev'));

// 公開ディレクトリ設定
app.use(express.static('public'));

// セッションの設定 maxAge nullでセッションクッキー
app.use(session({
  secret: 'token',
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: null,
  },
}));
//--------------------------------------------------
// ルーティング
//--------------------------------------------------
const index = require('./app/routes/index');
app.use('/', index);
const setup = require('./app/routes/setup');
app.use('/setup', setup);
const login = require('./app/routes/login');
app.use('/login', login);
const logout = require('./app/routes/logout');
app.use('/logout', logout);
const calendar = require('./app/routes/calendar');
app.use('/calendar', calendar);

//--------------------------------------------------
// APIルーティング
//--------------------------------------------------
const apiRoutes = new express.Router();
// 認証不要 api --------
// POST(http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

  // find db by posted name
  User.findOne({
    id: req.body.id,
  }, function(err, user) {
    if(err) {
      throw err;
    }

    // validation
    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.',
      });
      return;
    }

    if (user.password !== req.body.password) {
      res.json({
        success: false,
        message: 'Authentication failed. Wrong password.',
      });
      return;
    }

    // when valid -> create token
    const token = jwt.sign(user, app.get('superSecret'), {
      expiresIn: '24h',
    });

    // アクセストークン
    req.session.token = token;
    // 代表者
    req.session.delegate = user.delegate;
    req.session.save();

    res.json({
      success: true,
      message: 'Authentication successfully finished.',
      token: token,
    });

  });

});

// これ以降のルーティングは認証が必要
apiRoutes.use(function(req, res, next) {

  // get token from body:token or query:token of Http Header:x-access-token
  // const token = req.body.token || req.query.token || req.headers['x-access-token'];
  const token = req.session.token;

  // validate token
  if (!token) {
    return res.status(403).send({
      success: false,
      message: 'No token provided.',
    });
  }

  jwt.verify(token, app.get('superSecret'), function(err, decoded) {
    if (err) {
      return res.json({
        success: false,
        message: 'Invalid token',
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
  res.json({message: 'Welcome to API routing'});
});

// GET(http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      throw err;
    }
    res.json(users);
  });
});

apiRoutes.get('/schedule', function(req, res) {
  // TODO: チームIDで検索
  const start = req.query.start + ' T09:00:00+0900';
  const end = req.query.end + ' T09:00:00+0900';
  Schedule.find({start: {$gte: start, $lt: end}}, function(err, schedules) {
    if (err) {
      throw err;
    }
    res.json(schedules);
  });
});

apiRoutes.post('/schedule', function(req, res) {
  const schedule = new Schedule({
    team_id: 'null',
    title: req.body.title,
    start: req.body.start + ' T09:00:00+0900',
    end: req.body.end + ' T09:00:00+0900',
    allDay: false,
    location: req.body.location,
    memo: req.body.memo,
  });

  schedule.save({}, function(err) {
    if (err) {
      throw err;
    }
    res.json({success: true});
  });
});

apiRoutes.delete('/schedule', function(req, res) {
  Schedule.remove({_id: req.body._id}, function(err) {
    if (err) {
      throw err;
    }
    res.json({success: true});
  });
});

apiRoutes.put('/schedule', function(req, res) {
  Schedule.findOne({_id: req.body._id}, function (err, doc) {
    doc.team_id = 'null';
    doc.title = req.body.title;
    doc.start = req.body.start + ' T09:00:00+0900';
    doc.end = req.body.end + ' T09:00:00+0900';
    doc.save({}, function(err) {
      if (err) {
        throw err;
      }
      res.json({success: true});
    });
  });
});

apiRoutes.get('/logout', function(req, res) {
  req.session.destroy();
  res.json({message: 'Logout'});
});

app.use('/api', apiRoutes);

module.exports = app;
