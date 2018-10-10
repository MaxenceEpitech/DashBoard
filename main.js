var express = require('express');
var mysql = require('mysql');

var app = express();

var htmlController = require('./controllers/htmlController');

app.use('/assets', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use('/', function (req, res, next) {
	console.log('Request Url:' + req.url);
	
	var con = mysql.createConnection({
		host: "localhost",
		user: "max",
		password: "abcabcabc",
		database: "dashboard"
	});

	
/*
 * con.query('SELECT People.ID, Firstname, Lastname, Address FROM People INNER
 * JOIN PersonAddresses ON People.ID = PersonAddresses.PersonID INNER JOIN
 * Addresses ON PersonAddresses.AddressID = Addresses.ID', function(err, rows) {
 * if(err) throw err; console.log(rows); } );
 */	
	next();
});

htmlController(app);

app.listen(8080);