const express = require('express');
const path = require('path');
const session = require('express-session');

const users = require('./user.js');
const database = require('./mysql.js');

const router = express.Router();
const parentDir = path.normalize(__dirname + "/..");

var user;

const noError = {
      username: 0,
      password: 0,
      email: 0
};
var error = noError;

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
            res.render('dashboard', {widgets: users.getAllWidgets()});
      } else {
            res.redirect('/login');
      }
});

/*
        Signup Route
 */
router.route('/signup')
      .get(sessionChecker, (req, res) => {
            res.render('signup', {error: error});
      })
      .post((req, res) => {
            const sess = req.session;
            const username = req.body.username;
            const password = req.body.password;
            const email = req.body.email;

            error = noError;
            const newError = database.signup(info = {username, password, email});
            if (newError.username || newError.password || newError.email) {
                  error = newError;
                  res.redirect('/signup');
                  return;
            } else {
                  sess.username = username;
                  res.redirect('/dashboard');
                  return;
            }
      });

/*
        Login Route
 */
router.route('/login')
      .get(sessionChecker, (req, res) => {
            res.render('login', {error: error});
            if (error.mysql || error.username || error.password) {
                  error = noError;
            }
      })
      .post((req, res) => {
            const sess = req.session;
            const username = req.body.username;
            const password = req.body.password;

            error = noError;
            database.getResult(info = {username, password}, function (err, newError) {
                  if (!err) {
                        if (newError.mysql || newError.username || newError.password) {
                              error = newError;
                              res.redirect("/login");
                        } else {
                              error = noError;
                              sess.username = username;
                              users.createUser({username, password});
                              users.printUser();

                              res.redirect('/dashboard');
                        }
                  } else {
                        console.log(err);
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

router.get('/editModule', (req, res) => {

});

module.exports = router;