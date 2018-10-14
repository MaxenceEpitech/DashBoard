const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');
const mysql = require('mysql');

var app = express();

app.set('port', 8080);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
	key: 'user_sid',
	secret: 'somerandonstuffs',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 600000
	}
}));

var con = mysql.createConnection({
	host: "localhost",
	user: "max",
	password: "abcabcabc",
	database: "dashboard"
});

var sess;

con.connect(function(err) {
	if (!err) {
		console.log("Database is connected ...");
	} else {
		console.log("Error connecting database ...");
	}
});

var sessionChecker = (req, res, next) => {
	sess = req.session;
	if (sess.username) {
	        res.redirect('/dashboard');		
	} else {
		next();
	}
};

app.get('/', sessionChecker, (req, res) => {
	res.redirect('/login');
});

app.route('/signup')
	.get(sessionChecker, (req, res) => {
		res.sendFile(__dirname + '/public/signup.html');
	})
	.post((req, res) => {
		sess = req.session;
		var username = req.body.username;
		var password = req.body.password;
		
		if (!username || !password || username.length <= 1 || password.length <= 4) {
			res.redirect('/signup');
		}
		var data = 'INSERT INTO users (username, password) VALUES (\'' + username + '\', \'' + password + '\')';
		con.query(data, function (error, results, fields) {
			if (error) {
				res.redirect('/signup');
			} else {
				sess.username = username;
				res.redirect('/dashboard');
			}
		});
	});

app.route('/login')
	.get(sessionChecker, (req, res) => {
		res.sendFile(__dirname + '/public/login.html');
	})
	.post((req, res) => {
		sess = req.session;
		var username = req.body.username;
		var password = req.body.password;
        
		con.query('SELECT * FROM users WHERE username = ?', [ username ], function(error, results, fields) {
			if (error) {
				res.redirect('/login');
			} else {
				if (results.length > 0) {
					if (results[0].password == password) {
						sess.username = username;
						res.redirect('/dashboard');
					} else {
						res.redirect('/login');						
					}
				} else {
					res.redirect('/login');
				}
			}
		});
});

app.get('/dashboard', (req, res) => {
	sess = req.session;
	if (sess.username) {
	        res.sendFile(__dirname + '/public/dashboard.html');
	} else {
		res.redirect('/login');
	}
});

app.get('/logout', (req, res) => {
	sess = req.session;
	req.session.destroy(function(err) {
		if(err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});

app.use(function (req, res, next) {
	res.status(404).send("404 Unknown Path")
});

app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));
