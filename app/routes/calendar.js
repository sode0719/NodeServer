var express = require('express');
var router  = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var login = false;
  if(req.session.token) {
    login = true;
  }
  var delegate = req.session.delegate;
  res.render('calendar', { title: 'カレンダー', login: login, delegate: delegate});
});

module.exports = router;
