var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let result = { title:  ' Welcome to my app' };
  res.send({result:result} );
});

module.exports = router;
