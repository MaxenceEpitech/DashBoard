/**
 * http://usejsdoc.org/
 */

var bodyParser = require('body-parser');
var mysql = require('mysql');

var session = require('express-session');
var mySqlStore = require('express-mysql-session');// (session);

var options = {
		host: 'localhost',
		user: 'max',
		password: 'abcabcabc',
		database: 'dashboard'
};

var urlencodedParser = bodyParser.urlencoded({
	extended : false
});

module.exports = function(app) {
	
	var sessionStore = new mySqlStore(options);	
	
	app.get('/', function(req, res) {
		res.render('index');
	});
	
	app.post('/dashboard', function(req, res) {
		res.render('dashboard');
	});

	app.get('/person/:id', function(req, res) {
		res.render('person', {
			ID : req.params.id,
			Qstr : req.query.qstr
		});
	});

	app.post('/person', urlencodedParser, function(req, res) {
		console.log(req.body);

		var con = mysql.createConnection(options);

		// Login
		con.connect(function(err) {
			
			
			if (err)
				throw err;
			console.log('Connected to Database');

			var username = req.body.firstname;
			var password = req.body.lastname;
			console.log('requested username = ' + username);

			con.query('SELECT * FROM users WHERE username = ?', [ username ], function(error, results, fields) {
				console.log('request send');
				if (error) {
					// console.log("error ocurred",error);
					res.send({
						"code" : 400,
						"failed" : "error ocurred"
					})
				} else {
					// console.log('The solution is: ',
					// results);
					if (results.length > 0) {
						if (results[0].password == password) {
							res.redirect('/dashboard');
						} else {
							res.send({
								"code" : 204,
								"success" : "Email and password does not match"
							});
						}
					} else {
						console.log('username dont exist.');
						res.send({
							"code" : 204,
							"success" : "Username does not exits"
						});
					}
				}
			});
		});

		// Register
		/*
		 * con.connect(function(err) { if (err) throw err;
		 * console.log("Connected!"); var sql = "INSERT INTO users
		 * (username, password) VALUES ('" + req.body.firstname + "','" +
		 * req.body.lastname + "' )"; // var addresssesSQL = "INSERT
		 * INTO Addresses (Address) // //VALUES ('"+req.body.address+ "'
		 * )";
		 * 
		 * console.log(sql); con.query(sql, function(err, result) {
		 * console.log(result.insertId); // peopleID = result.insertId;
		 * 
		 * if (err) throw err; });
		 * 
		 * });
		 */

	});

}