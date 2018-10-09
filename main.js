var express = require('express');
//var morgan = require('morgan');
//var favicon = require('serve-favicon');
//var mysql = require('mysql');
//var bodyParser = require('body-parser');

var app = express();

//app.use(morgan('combined'))
//app.use(express.static(__dirname + '/public'))
//app.use(favicon(__dirname + '/public/favicon.ico'))
//var urlencodedParser = bodyParser.urlencoded({ extended: true });
/*
 * app.use(function(req, res){ res.send('Hello'); });
 */

/*
app.get('/', function(req, res) {
	res.render('index.ejs');
	var username = req.query.username;
	var password = req.query.password;
	if (typeof username !== 'undefined' && username
			&& typeof password !== 'undefined' && password) {
		console.log('Trying Login.');
		console.log('username = ' + username);
		console.log('password = ' + password);
	}
});*/

//GET method route
app.get('/', function (req, res) {
  res.send('GET request to the homepage');
});

// POST method route
app.post('/', function (req, res) {
  res.send('POST request to the homepage');
});


app.get('/index', function(req, res) {
	res.setHeader('Content-Type', 'text/plain');
	res.send('hello');
});

app.get('/etage/:etagenum/chambre', function(req, res) {
	res.render('tmp.ejs', {
		etage : req.params.etagenum
	});
});

app.use(function(req, res, next) {
	res.setHeader('Content-Type', 'text/plain');
	res.status(404).send('Page introuvable !');
});

app.listen(8080);