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
      widget: 'Weather Days',
      file: 'weather_days.ejs'
}

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
      getData: function () {
            return data;
      },

      /*
                  Generic function to setRefreshRate of Data
       */
      setRefreshRate: function (newRate) {
            refreshRate = newRate;
      }
};