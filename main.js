var express = require('express');
var morgan = require('morgan');
var favicon = require('serve-favicon');
var mysql = require('mysql');
var body = require('body-parser');

var app = express();

app.use(morgan('combined'))
app.use(express.static(__dirname + '/public'))
app.use(favicon(__dirname + '/public/favicon.ico'))
/*
app.use(function(req, res){
	res.send('Hello');
});*/

app.get('/', function(req, res) {
	res.render('index.ejs');
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