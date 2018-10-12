/**
 * http://usejsdoc.org/
 */
var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('postgres://postgres@localhost:5432/auth-system');

// setup User model and its fields.
var User = sequelize.define('users', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    }    
});

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = User;
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
		res.render('main');
	});
	
	app.post('/login', function(req, res) {
		res.render('login');
	});
	
	app.post('/register', function(req, res) {
		res.render('register');
	});
	
	app.post('/dashboard', function(req, res) {
		console.log(req.body);
		//var user = req.body.username;
		res.render('dashboard');
	});

	/*
	app.get('/person/:id', function(req, res) {
		res.render('person', {
			ID : req.params.id,
			Qstr : req.query.qstr
		});
	});*/

	/*
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
	});
	*/

}