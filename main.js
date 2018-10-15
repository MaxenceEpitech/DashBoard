const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const auth = require('./routes/auth.js');
app.use(express.static(__dirname + '/public'));

app.set('port', 8080);
app.use(morgan('dev')); //Dev
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

/*
            Calling Auth.js router
 */
app.use(auth);

/*
            404 Page not found
 */
app.use(function (req, res, next) {
      res.status(404).send("404 Page not found")
});

app.listen(app.get('port'));
