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
      service: 'Weather',
      widget: 'Pressure',
      file: 'mod_weather_presure.ejs'
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
      }
};