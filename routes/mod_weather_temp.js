const OpenWeatherMapHelper = require("openweathermap-node");
const helper = new OpenWeatherMapHelper(
      {
            APPID: '76028bc8efb3d6b143d3c18a2335137b',
            units: "metric"
      }
);

var refreshRate = 10;
var data = {
      // Widget required data
      city: 'Paris',

      // Widget return data
      temperature: 0,

      // Mandatory to work
      activated: false,
      service: 'Weather',
      widget: 'Temperature',
      file: 'mod_weather_temp.ejs',
      edit: 'mod_weather_pressure'
};

module.exports = {

      /*
                  Generic function to refreshData
       */
      refresh: function () {
            helper.getCurrentWeatherByCityName(data.city, (err, currentWeather) => {
                  if (err) {
                        console.log(err);
                  }
                  else {
                        data.temperature = currentWeather.main.temp;
                        console.log("temp = ", currentWeather.main.temp);
                  }
            });
      },

      /*
                Generic function Change Data
       */
      setData: function (city) {
            data.city = city;
            this.refresh();
      },

      /*
                  Generic function getData for Front file
       */
      getResult: function () {
            return data;
      },      getName: function() {
            return data.widget;
      },


      /*
                  Generic function to setRefreshRate of Data
       */
      setRefreshRate: function (newRate) {
            refreshRate = newRate;
      },

      isOn: function () {
            return data.activated;
      },

      /*
                  Generic function activate
       */
      toggle: function (name) {
            console.log("name" + name);
            if (name == data.widget) {
                  console.log("SALUT");
                  if (data.activated == false) {
                        data.activated = true;
                  } else {
                        data.activated = false;
                  }
                  console.log("ICI");
                  return true;
            }
            return false;
      }

};