var express = require('express');
var router  = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var login = false;
  if(req.session.token) {
    login = true;
  }

  res.render('index', { title: 'ホーム', login: login});
});

module.exports = router;
