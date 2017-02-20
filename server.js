'use strict';
//--------------------------------------------------
// モジュール
//--------------------------------------------------
const express    = require('express');
const app        = express();
const session    = require('express-session');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const mongoose   = require('mongoose');
const jwt        = require('jsonwebtoken');
const path       = require('path');
const cors       = require('cors');

// MongoDB
const config     = require('./app/util/config');
const User       = require('./app/models/user');
const ObjectId   = require('mongoose').Types.ObjectId;

const log        = require('./app/util/logger');

log.info('Server Starting...');
//--------------------------------------------------
// コンフィグ
//--------------------------------------------------
// データベース接続
mongoose.connect(config.database, function(err) {
  if(err) {
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
    // cookieへのアクセスをHTTPのみに制限
    httpOnly: true,
    // クッキーの有効期限(msec)
    maxAge: null,
  },
}));

// CORSを許可する
app.use(cors({origin: '*'}));

//--------------------------------------------------
// ルーティング
//--------------------------------------------------
const index = require('./app/routes/index');
app.use('/', index);

const register = require('./app/routes/register');
app.use('/register', register);

const login = require('./app/routes/login');
app.use('/login', login);

const logout = require('./app/routes/logout');
app.use('/logout', logout);

const calendar = require('./app/routes/calendar');
app.use('/calendar', calendar);

const dispatcher = require('./app/routes/dispatcher');
app.use('/dispatcher', dispatcher);

const score = require('./app/routes/score');
app.use('/score', score);

const u = require('./app/routes/user');
app.use('/user', u);

const t = require('./app/routes/team');
app.use('/team', t);

//--------------------------------------------------
// APIルーティング
//--------------------------------------------------
const apiRoutes = new express.Router();
// 認証不要 api --------
const user = require('./app/routes/api/user');
apiRoutes.use('/user', user);

const team = require('./app/routes/api/team');
apiRoutes.use('/team', team);

// POST(http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

  // find db by posted name
  User.findOne({id: req.body.id, isDelete: false}, function(err, user) {
    if(err) {
      throw err;
    }

    // validation
    if(!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.',
      });
      return;
    }

    if(user.password !== req.body.password) {
      res.json({
        success: false,
        message: 'Authentication failed. Wrong password.',
      });
      return;
    }

    // when valid -> create token
    const token = jwt.sign(user, app.get('superSecret'), {expiresIn: '24h'});

    // アクセストークン
    req.session.token = token;
    // 代表者
    req.session.delegate = user.delegate;
    // チームID
    req.session.team_id = user.team_id;
    req.session.user_id = user._id;

    req.session.save();

    res.json({
      success: true,
      token: token,
      team_id: user.team_id,
      user_id: user._id,
    });
  });
});

// これ以降のルーティングは認証が必要
apiRoutes.use(function(req, res, next) {
  // get token from body:token or query:token of Http Header:x-access-token
  // const token = req.body.token || req.query.token || req.headers['x-access-token'];

  // セッションかパラメータで認証
  // PCはセッション
  // Androidはパラメータ
  const token = req.query.token || req.body.token || req.session.token;

  // console.log('query: ' + req.query.token);
  // console.log('session : ' + req.session.token);

  // validate token
  if(!token) {
    return res.status(403).send({
      success: false,
      message: 'No token provided.',
    });
  }

  jwt.verify(token, app.get('superSecret'), function(err, decoded) {
    if(err) {
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
  User.find(function(err, users) {
    if(err) {
      throw err;
    }
    res.json(users);
  });
});

apiRoutes.get('/logout', function(req, res) {
  req.session.destroy();
  res.json({message: 'Logout'});
});

const schedule = require('./app/routes/api/schedule');
apiRoutes.use('/schedule', schedule);

const dispat = require('./app/routes/api/dispatcher');
apiRoutes.use('/dispatcher', dispat);

const scoresheet = require('./app/routes/api/score');
apiRoutes.use('/score', scoresheet);

app.use('/api', apiRoutes);

module.exports = app;
