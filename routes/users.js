var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/test', function(req, res, next) {
  console.log('test');
  res.send({result:true});
});


module.exports = router;
