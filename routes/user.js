var mod_weather_temp = require('./mod_weather_temp.js');
var mod_weather_presure = require('./mod_weather_presure.js');

var myUser = {
      username: '',
      password: '',
      email: '',

      services: [
            {
                  activated: true,
                  setRefreshRate: function(rate) {mod_weather_temp.setRefreshRate(rate)},
                  refresh: function() {return mod_weather_temp.refresh()},
                  getData: function() {return mod_weather_temp.getResult()},
                  setData: function(data) {mod_weather_temp.setData(data)}
            },

            {
                  activated: true,
                  setRefreshRate: function(rate) {mod_weather_presure.setRefreshRate(rate)},
                  refresh: function() {return mod_weather_presure.refresh()},
                  getData: function() {return mod_weather_presure.getResult()},
                  setData: function(data) {mod_weather_presure.setData(data)}
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

      refreshAllWidgets: function() {
            for (var i = 0; i < myUser.services.length; i++) {
                  myUser.services[i].refresh();
            }
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
