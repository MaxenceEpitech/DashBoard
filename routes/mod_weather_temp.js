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
      service: 'Weather',
      widget: 'Temperature',
      file: 'mod_weather_temp.ejs'
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
      },

      /*
                  Generic function to setRefreshRate of Data
       */
      setRefreshRate: function (newRate) {
            refreshRate = newRate;
      }
};