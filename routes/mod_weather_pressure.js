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
      pressure: undefined,

      // Mandatory to work
      activated: true,
      service: 'Weather',
      widget: 'Pressure',
      file: 'mod_weather_pressure.ejs',
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
                        data.pressure = currentWeather.main.pressure;
                        console.log("pressure " + currentWeather.main.pressure);
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
            if (name == data.widget) {
                  if (data.activated == false) {
                        data.activated = true;
                  } else {
                        data.activated = false;
                  }
                  return true;
            }
            return false;
      }
};