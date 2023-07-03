var express = require('express');
var router = express.Router();
const { parse } = require('rss-to-json');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', async function(req, res, next) {
  var rss = await parse('https://lifehacker.com/rss');
  res.send(rss);
});

module.exports = router;
