var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser');

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' })
})

// with JSON
router.get('/api1', jsonParser, urlencodedParser, function (req, res, next) {
    // $.get('/api', {id: 1, name: "titi"}, function(d) {}).done(d => {console.log(d)}).fail(f => {console.log(f)});
    console.log(`API1 GET query`, req.query);
    console.log(`API1 GET body`, req.body);
    // $.get('/api/1/titi', function(data) { console.log(data)}).done(d => {console.log(d)}).fail(f => {console.log(f)});
    console.log(`API1 GET params`, req.params);
    res.status(200).send('ok');
});

// with params
router.get('/api2/:id?/:name?', jsonParser, urlencodedParser, function (req, res, next) {
    // $.get('/api', {id: 1, name: "titi"}, function(d) {}).done(d => {console.log(d)}).fail(f => {console.log(f)});
    console.log(`API2 GET query`, req.query);
    console.log(`API2 GET body`, req.body);
    // $.get('/api/1/titi', function(data) { console.log(data)}).done(d => {console.log(d)}).fail(f => {console.log(f)});
    console.log(`API2 GET params`, req.params);
    res.status(200).send('ok')
});

// post with JSON
router.post('/api1', jsonParser, urlencodedParser, function (req, res, next) {
    // $.get('/api', {id: 1, name: "titi"}, function(d) {}).done(d => {console.log(d)}).fail(f => {console.log(f)});
    console.log(`API1 POST query`, req.query);
    console.log(`API1 POST body`, req.body);
    // $.get('/api/1/titi', function(data) { console.log(data)}).done(d => {console.log(d)}).fail(f => {console.log(f)});
    console.log(`API1 POST params`, req.params);
    res.status(200).send('ok')
});

module.exports = router;
