const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const auth = require('./routes/auth.js');

app.set('port', 8080);
app.use(morgan('dev')); //Dev
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

/*
            Calling Auth.js router
 */
app.use(auth);

/*
            DashBoard
 */
app.get('/dashboard', (req, res) => {
      const sess = req.session;
      if (sess.username) {
            res.sendFile(__dirname + '/public/dashboard.html');
      } else {
            res.redirect('/login');
      }
});

app.get('/nav', (req, res) => {
      res.sendFile(__dirname + '/public/nav.html');
});

/*
            404 Page not found
 */
app.use(function (req, res, next) {
      res.status(404).send("404 Page not found")
});

app.listen(app.get('port'));
