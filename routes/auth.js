const express = require('express');
const mysql = require('mysql');
const path = require('path');
const session = require('express-session');
const users = require('./user.js');

const router = express.Router();
const parentDir = path.normalize(__dirname + "/..");

var user;

/*
        Init Session Saving
 */
router.use(session({
      key: "user_sid",
      secret: "somerandonstuffs",
      resave: false,
      saveUninitialized: false,
      cookie: {
            expires: 600000
      }
}));

/*
        Initializing Connection to mysql Database
 */
const con = mysql.createConnection({
      host: "localhost",
      user: "max",
      password: "abcabcabc",
      database: "dashboard"
});

/*
        Check if user's session is connected
 */
const sessionChecker = (req, res, next) => {
      const sess = req.session;
      if (sess.username) {
            res.redirect('/dashboard');
            return;
      } else {
            next();
      }
};

/*
        Connecting local connection to Database
 */
con.connect(function (err) {
      if (!err) {
            console.log("Database is connected ...");
      } else {
            console.log("Error connecting database ...");
      }
});

/*
        Get to Root
 */
router.get('/', sessionChecker, (req, res) => {
      res.redirect('/login');
      return;
});

/*
            DashBoard
 */
router.get('/dashboard', (req, res) => {
      const sess = req.session;
      if (sess.username) {
            res.render('dashboard', {widgets : users.getAllWidgets()});
      } else {
            res.redirect('/login');
      }
});

/*
        Signup Route
 */
router.route('/signup')
      .get(sessionChecker, (req, res) => {
            res.render('index'); // tmp
      })
      .post((req, res) => {
            const sess = req.session;
            const username = req.body.username;
            const password = req.body.password;

            if (!username || !password || username.length <= 0 || password.length <= 0) {
                  res.redirect('/signup');
                  return;
            }
            const queryString = "INSERT INTO users (username, password, weather) VALUES (?, ?, 0)";
            con.query(queryString, [username, password], function (error, rows, fields) {
                  if (error) {
                        res.redirect('/signup');
                        return;
                  } else {
                        sess.username = username;
                        res.redirect('/dashboard');
                        return;
                  }
            });
      });

/*
        Login Route
 */
router.route('/login')
      .get(sessionChecker, (req, res) => {
            res.render('login');
      })
      .post((req, res) => {
            const sess = req.session;
            const username = req.body.username;
            const password = req.body.password;
            const queryString = "SELECT * FROM users WHERE username = ?";
            con.query(queryString, [username], function (error, results, fields) {
                  if (error) {
                        res.redirect("/login");
                  } else {
                        if (results.length > 0) {
                              if (results[0].password == password) {
                                    sess.username = username;
                                    users.createUser(results);
                                    users.printUser();

                                    res.redirect('/dashboard');
                                    return;
                              } else {
                                    res.redirect('/login');
                                    return;
                              }
                        } else {
                              res.redirect('/login');
                              return;
                        }
                  }
            });
      });

/*
        Logout user
 */
router.get('/logout', (req, res) => {
      req.session.destroy(function (err) {
            if (err) {
                  console.log(err);
            } else {
                  res.redirect('/');
                  return;
            }
      });
});

module.exports = router;