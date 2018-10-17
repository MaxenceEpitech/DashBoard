const express = require('express');
const path = require('path');
const session = require('express-session');

const users = require('./user.js');
const database = require('./mysql.js');
const errorHandler = require('./errorHandler');

const router = express.Router();

var error = errorHandler.createError();

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
            Home
 */
router.get('/home', (req, res) => {
      const sess = req.session;
      if (sess.username) {
            const username = users.getUsername();
            res.render('home', {user: username});
            return;
      } else {
            res.render('home', {user: null});
            return;
      }
      res.end();
});

/*
            DashBoard
 */
router.get('/dashboard', (req, res) => {
      const sess = req.session;
      if (sess.username) {
            users.refreshAllWidgets();
            const username = users.getUsername();
            res.render('dashboard', {widgets: users.getAllWidgets(), user: username});
            return;
      } else {
            error.dashboard = 1;
            res.redirect('/login');
            return;
      }
});

/*
        Signup Route
 */
router.route('/signup')
      .get(sessionChecker, (req, res) => {
            const username = users.getUsername();
            res.render('signup', {error: error, user: username});
      })
      .post((req, res) => {
            const sess = req.session;
            const username = req.body.username;
            const password = req.body.password;
            const email = req.body.email;

            error = errorHandler.createError();
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
            const username = users.getUsername();
            res.render('login', {error: error, user: username});
            if (error.mysql || error.username || error.password || error.dashboard) {
                  error = errorHandler.createError();
            }
      })
      .post((req, res) => {
            const sess = req.session;
            const username = req.body.username;
            const password = req.body.password;

            error = errorHandler.createError();;
            database.getResult(info = {username, password}, function (err, newError) {
                  if (!err) {
                        if (newError.mysql || newError.username || newError.password) {
                              error = newError;
                              res.redirect("/login");
                        } else {
                              error = errorHandler.createError();;
                              sess.username = username;
                              users.createUser({username, password});
                              //users.printUser();

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
      if (req.session) {
            req.session.destroy(function (err) {
                  if (err) {
                        console.log(err);
                  } else {
                        res.redirect('/home');
                        return;
                  }
            });
      } else {
            error.logout = 1;
            res.redirect('/home');
      }
});

module.exports = router;