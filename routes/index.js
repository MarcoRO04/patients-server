const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let result = { title:  ' Welcome to my app' };
  // res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  //res.send({result:result} );
  res.render('index', { title: 'Welcome to my app', result: result});
});

module.exports = router;
