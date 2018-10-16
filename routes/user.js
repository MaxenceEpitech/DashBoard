var weather_days = require('./weather_days.js');

var myUser = {
      username: '',
      password: '',
      email: '',

      services: [
            {
                  activated: true,
                  setRefreshRate: function(rate) {weather_days.setRefreshRate(rate)},
                  refresh: function() {return weather_days.refresh()},
                  getData: function() {return weather_days.getData()},
                  setData: function(data) {weather_days.setData(data)}
            },

            {
                  activated: false,
                  setRefreshRate: function(rate) {weather_days.setRefreshRate(rate)},
                  refresh: function() {return weather_days.refresh()},
                  getData: function() {return weather_days.getData()},
                  setData: function(data) {weather_days.setData(data)}
            }
      ]
};

module.exports = {
      createUser: function (mysqlData) {
            myUser.username = mysqlData.username;
            myUser.password = mysqlData.password;
            return;
      },

      getAllWidgets: function() {
            var widgets = [];
            var widgetSize = 0;
            for (var i = 0; i < myUser.services.length; i++) {
                  if (myUser.services[i].activated) {
                        widgets[widgetSize] = myUser.services[i].getData();
                        widgetSize++;
                  }
            }
            return widgets;
      },

      printUser: function () {
            console.log("Username " + myUser.username);
            console.log("Password " + myUser.password);

            myUser.services[0].refresh();

            console.log('data Get' + myUser.services[0].getData());

            return;
      },

      getUsername: function() {
            return myUser.username;
      },

      getEmail: function() {
            return myUser.email;
      }


};
