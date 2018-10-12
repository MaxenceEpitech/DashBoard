var express = require('express');
var bodyParser = require('body-parser');
									// var
									// cookieParser
									// =
									// require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
// var User = require('./models/user');
var mysql = require('mysql');

// invoke an instance of express application.
var app = express();

// set our application port
app.set('port', 8080);

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

app.set('view engine', 'ejs');

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the
// browser.
									// app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across
// sessions.
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

// This middleware will check if user's cookie is still saved in browser and
// user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your
// cookie still remains saved in the browser.
app.use((req, res, next) => {
										sess = req.session; // new
	/*
	 * if (req.cookies.user_sid && !req.session.user) {
	 * res.clearCookie('user_sid'); }
	 */
	next();
});


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
	
	/*
	 * if (req.session.user && req.cookies.user_sid) {
	 * res.redirect('/dashboard'); } else { next(); }
	 */
	sess = req.session;
	if (sess.username) {
	        res.redirect('/dashboard');		
	} else {
		next();
	}
};


// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
	res.redirect('/login');
});


// route for user signup
app.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/signup.html');
    })
    .post((req, res) => {
	    sess = req.session;
	/*
	 * User.create({ username: req.body.username, email: req.body.email,
	 * password: req.body.password }) .then(user => { req.session.user =
	 * user.dataValues; res.redirect('/dashboard'); }) .catch(error => {
	 * res.redirect('/signup'); });
	 */
    });


// route for user Login
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/login.html');
    })
    .post((req, res) => {
	sess = req.session; // always
        var username = req.body.username,
            password = req.body.password;
        
	con.query('SELECT * FROM users WHERE username = ?', [ username ], function(error, results, fields) {
		if (error) {
			// console.log("error ocurred",error);
			res.redirect('/login');
		} else {
			// console.log('The solution is: ', results);
			if (results.length > 0) {
				if (results[0].password == password) {
					console.log('login');
					sess.username = username;
			                // req.session.user = user.dataValues;
			                res.redirect('/dashboard');

				} else {
			                res.redirect('/login');						
				}
			} else {
		                res.redirect('/login');
			}
		}
/*
 * User.findOne({ where: { username: username } }).then(function (user) { if
 * (!user) { res.redirect('/login'); } else if (!user.validPassword(password)) {
 * res.redirect('/login'); } else { // Save in cookies req.session.user =
 * user.dataValues; res.redirect('/dashboard'); } });
 */
	});
    });


// route for user's dashboard
app.get('/dashboard', (req, res) => {
	/*
	 * if (req.session.user && req.cookies.user_sid) {
	 * res.sendFile(__dirname + '/public/dashboard.html'); } else {
	 * res.redirect('/login'); }
	 */
	sess = req.session;
	if (sess.username) {
	        res.sendFile(__dirname + '/public/dashboard.html');
	} else {
		res.redirect('/login');
	}
});


// route for user logout
app.get('/logout', (req, res) => {
	sess = req.session;
	req.session.destroy(function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect('/');
		}
});


// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});


// start the express server
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));
