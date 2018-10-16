const mysql = require('mysql');
const emailValidator = require('email-validator');
const errorHandler = require('./errorHandler');

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
        Connecting local connection to Database
 */
con.connect(function (err) {
      if (!err) {
            console.log("Database is connected ...");
      } else {
            console.log("Error connecting database ...");
      }
});

module.exports = {
      signup: function (info) {

            var error = errorHandler.createError();
            var exit = 0;
            if (!info.username || info.username.length < 4 || info.username.length > 15) {
                  console.log("Unvalid username");
                  exit = 1;
                  error.username = 1;
            }
            if (!info.password || info.password.length < 4 || info.password.length > 15) {
                  console.log("Unvalid password");
                  exit = 1;
                  error.password = 1;
            }
            if (!info.email || !emailValidator.validate(info.email)) {
                  console.log("Unvalid email");
                  exit = 1;
                  error.email = 1;
            }

            if (exit) {
                  return error;
            }

            const queryString = "INSERT INTO users (username, password, email, weather) VALUES (?, ?, ?, 0)";
            con.query(queryString, [info.username, info.password, info.email], function (err, rows, fields) {
                  console.log("ici");
                  if (error) {
                        console.log("Error : mysql");
                        error.mysql = 1;
                  } else {
                        error = errorHandler.createError();
                  }
            });
            return (error);
      },

      execQuery: function (info, callback) {
            var error = errorHandler.createError();
            const queryString = "SELECT * FROM users WHERE username = ?";
            con.query(queryString, [info.username], function (err, results, fields) {
                  if (err) {
                        error.mysql = 1;
                        callback(err, null);
                  } else {
                        if (results.length > 0) {
                              if (results[0].password == info.password) {
                                    error = errorHandler.createError();
                                    callback(null, error);
                              } else {
                                    error.password = 1;
                                    callback(null, error);
                              }
                        } else {
                              error.username = 1;
                              callback(null, error);
                        }
                  }
                  return error;
            });

      },

      getResult: function (info, callback) {
            this.execQuery(info, function (err, rows) {
                  if (!err) {
                        callback(null, rows);
                  } else {
                        callback(true, err);
                  }
            });
      },

      login: function (info) {

            if (!info.username || !info.password) {
                  return {username: 1, password: 0, mysql: 0};
            }

            this.getResult(info, function (err, rows) {
                  if (!err) {

                        console.log("usr " + rows.username);
                        console.log("pass " + rows.password);

                        return rows;
                  } else {
                        console.log(err);
                  }
            });
      }
};

