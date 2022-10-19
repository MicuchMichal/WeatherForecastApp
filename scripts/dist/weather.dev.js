"use strict";

//const { Chart } = require("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js");
// const days = {
//   0: "Mon",
//   1: "Tue",
//   2: "Wed",
//   3: "Thu",
//   4: "Fri",
//   5: "Sat",
//   6: "Sun",
// }
var months = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sept",
  9: "Oct",
  10: "Nov",
  11: "Dec"
};
var api = "https://api.open-meteo.com/v1/forecast?latitude=51.5002&longitude=-0.1262&hourly=temperature_2m,relativehumidity_2m,weathercode,surface_pressure&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max&timezone=Europe%2FLondon";
var apiHistory = "https://api.open-meteo.com/v1/forecast?latitude=51.5002&longitude=-0.1262&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max&timezone=Europe%2FLondon&past_days=7";
/* 
    buttons
*/

var hourlyForecast = document.querySelector('.hourlyForecast');
var threeDaysForecast = document.querySelector('.threeDaysForecast');
var sevenDaysForecast = document.querySelector('.sevenDaysForecast');
var historyWeather = document.querySelector('.historyWeather');
var inputData = document.querySelector('.tableContent');
/* 
    hourly data
*/

fetch(api).then(function (response) {
  return response.json();
}).then(function (data) {
  var hourlyData = [];
  var hourlyChartDate = [];
  var hourlyChartTemp = [];
  hourlyData.push("\n    <li class=\"tableHeader\">\n      <span class=\"time\">Time</span> \n      <span>Temp.</span>\n      <span>Weather</span> \n      <span>Hum.</span> \n      <span>Pressure</span>\n    </li>");

  for (var i = 0; i < 48; i++) {
    //date extraction
    var temp = data.hourly.time[i];
    var outputMonth = temp.substring(5, 7);
    outputMonth = months[outputMonth - 1];
    var outputDay = temp.substring(8, 10);
    var outputHour = temp.substring(11); //data for charts

    hourlyChartDate[i] = "".concat(outputDay, " ").concat(outputMonth, " ").concat(outputHour);
    hourlyChartTemp[i] = data.hourly.temperature_2m[i]; //weather condition from function

    var tempWeather = weatherState(data.hourly.weathercode[i]);
    hourlyData.push("\n      <li>\n        <span class=\"time\">".concat(outputDay, ".").concat(outputMonth, " ").concat(outputHour, "</span> \n        <span class=\"temperature\">").concat(data.hourly.temperature_2m[i], "&#x2103</span>\n        <span class=\"weather\">").concat(tempWeather, "</span> \n        <span class=\"humidity\">").concat(data.hourly.relativehumidity_2m[i], "%</span> \n        <span class=\"pressure\">").concat(data.hourly.surface_pressure[i], " hpa</span>\n      </li>"));
  } //convert to string to delete commas


  hourlyData = hourlyData.join(""); //onload function to show loading page data

  window.onload = inputData.innerHTML = "".concat(hourlyData); //hourly forecast button eventlistenet

  hourlyForecast.addEventListener('click', function () {
    inputData.innerHTML = "".concat(hourlyData);
  });
  /* 
      hourly chart
  */

  var lineDailyChart = getChart(hourlyChartDate, hourlyChartTemp, 'hourlyChart');
  /* 
      3 days data
  */

  var threedaysData = [];
  var threedaysChartDate = [];
  var threedaysChartTemp = [];
  threedaysData.push("\n    <li class=\"tableHeader\">\n      <span class=\"time\">Time</span> \n      <span>Temp.</span>\n      <span>Weather</span> \n      <span>Hum.</span> \n      <span>Pressure</span>\n    </li>");

  for (var _i = 0; _i < 72; _i += 6) {
    //date extraction
    var _temp = data.hourly.time[_i];

    var _outputMonth = _temp.substring(5, 7);

    _outputMonth = months[_outputMonth - 1];

    var _outputDay = _temp.substring(8, 10);

    var _outputHour = _temp.substring(11); //data for charts


    threedaysChartDate[_i] = "".concat(_outputDay, " ").concat(_outputMonth, " ").concat(_outputHour);
    threedaysChartTemp[_i] = "".concat(data.hourly.temperature_2m[_i]); //weather condition

    var tempWeather = weatherState(data.hourly.weathercode[_i]);
    threedaysData.push("\n      <li>\n        <span class=\"time\">".concat(_outputDay, ".").concat(_outputMonth, " ").concat(_outputHour, "</span> \n        <span class=\"temperature\">").concat(data.hourly.temperature_2m[_i], "&#x2103</span>\n        <span class=\"weather\">").concat(tempWeather, "</span> \n        <span class=\"humidity\">").concat(data.hourly.relativehumidity_2m[_i], "%</span> \n        <span class=\"pressure\">").concat(data.hourly.surface_pressure[_i], " hpa</span>\n      </li>"));
  }

  threedaysData = threedaysData.join("");
  threeDaysForecast.addEventListener('click', function () {
    inputData.innerHTML = "".concat(threedaysData);
  });
  /* 
      3 days chart
  */

  var threedaysChart = getChart(threedaysChartDate, threedaysChartTemp, 'threedaysChart');
  /* 
      7 days data
  */

  var dailyData = [];
  var sevendaysChartDate = [];
  var sevendaysChartTemp = [];
  dailyData.push("\n      <li class=\"tableHeader\">\n        <span class=\"time\">Time</span> \n        <span>Max Temp</span>\n        <span>Min Temp</span> \n        <span>Weather</span> \n        <span>Max wind</span>\n      </li>");

  for (var _i2 = 0; _i2 < 7; _i2++) {
    //date extraction
    var tempDaily = data.daily.time[_i2];
    var monthDaily = tempDaily.substring(5, 7);
    monthDaily = months[monthDaily - 1];
    var dayDaily = tempDaily.substring(8, 10);
    var average = averageTemp(data.daily.temperature_2m_max[_i2], data.daily.temperature_2m_min[_i2]); //data for charts

    sevendaysChartDate[_i2] = "".concat(dayDaily, " ").concat(monthDaily);
    sevendaysChartTemp[_i2] = "".concat(average); //weather extraction 

    var tempWeatherDaily = weatherState(data.daily.weathercode[_i2]);
    dailyData.push("\n      <li>\n        <span class=\"time\">".concat(dayDaily, ". ").concat(monthDaily, "</span> \n        <span>").concat(data.daily.temperature_2m_max[_i2], "&#x2103</span>\n        <span>").concat(data.daily.temperature_2m_min[_i2], "&#x2103</span> \n        <span>").concat(tempWeatherDaily, "</span> \n        <span>").concat(data.daily.windspeed_10m_max[_i2], " km/h</span>\n      </li>"));
  }

  dailyData = dailyData.join("");
  sevenDaysForecast.addEventListener('click', function () {
    inputData.innerHTML = "".concat(dailyData);
  });
  /* 
      7 days chart
  */

  var sevenedaysChart = getChart(sevendaysChartDate, sevendaysChartTemp, 'sevendaysChart');
});
/* 
    history
*/

fetch(apiHistory).then(function (response) {
  return response.json();
}).then(function (data) {
  var historyData = [];
  var historychartDate = [];
  var historyChartTemperature = [];
  historyData.push("\n    <li class=\"tableHeader\">\n      <span class=\"time\">Time</span> \n      <span>Max Temp</span>\n      <span>Min Temp</span> \n      <span>Weather</span> \n      <span>Max wind</span>\n    </li>"); //console.log(data)

  for (var i = 0; i < 7; i++) {
    //date extraction
    var tempHist = data.daily.time[i];
    var monthHist = tempHist.substring(5, 7);
    monthHist = months[monthHist - 1];
    var dayHist = tempHist.substring(8, 10);
    var average = averageTemp(data.daily.temperature_2m_max[i], data.daily.temperature_2m_min[i]); //data for charts

    historychartDate[i] = "".concat(dayHist, " ").concat(monthHist);
    historyChartTemperature[i] = "".concat(average); //weather extraction 

    var tempWeatherHistory = weatherState(data.daily.weathercode[i]);
    historyData.push("\n    <li>\n      <span class=\"time\">".concat(dayHist, ". ").concat(monthHist, "</span> \n      <span>").concat(data.daily.temperature_2m_max[i], "&#x2103</span>\n      <span>").concat(data.daily.temperature_2m_min[i], "&#x2103</span> \n      <span>").concat(tempWeatherHistory, "</span> \n      <span>").concat(data.daily.windspeed_10m_max[i], " km/h</span>\n    </li>"));
  }

  historyData = historyData.join("");
  historyWeather.addEventListener('click', function () {
    inputData.innerHTML = "".concat(historyData);
  });
  /* 
    history chart
  */

  var historyChart = getChart(historychartDate, historyChartTemperature, 'historyChart');
  /* 
      chart section interface
  */

  var chartButtons = document.querySelectorAll('.chart-button');
  var chartSection = document.querySelector('.chartSection');
  var charts = document.querySelectorAll('.chartContent');
  chartSection.addEventListener('click', function (event) {
    var id = event.target.dataset.id; //console.log(id);

    if (id) {
      chartButtons.forEach(function (button) {
        button.classList.remove('activeButton');
        event.target.classList.add("activeButton");
      });
      charts.forEach(function (chart) {
        chart.classList.remove('active');
      });
      var element = document.getElementById(id);
      element.classList.add('active');
    }
  });
  /* 
      calculator interface
  */

  var calcButtons = document.querySelectorAll('.calc-button');
  var calculatorSection = document.querySelector('.calculatorSection');
  var calculator = document.querySelectorAll('.calculatorContent');
  calculatorSection.addEventListener('click', function (event) {
    var id = event.target.dataset.id;

    if (id) {
      calcButtons.forEach(function (button) {
        button.classList.remove('activeButton');
        event.target.classList.add('activeButton');
      });
      calculator.forEach(function (calc) {
        calc.classList.remove('activeCalc');
      });
      var element = document.getElementById(id);
      element.classList.add('activeCalc');
    }
  });
});
/* 
    calculation
*/

var celsiusNumberInput = document.getElementById('celsiusNumber');
var humidityInput = document.getElementById('humidity');
var submitButton = document.querySelector('.submitButton');
var resultOutput = document.querySelector('.result');
submitButton.addEventListener('click', function () {
  var celsius = parseFloat(celsiusNumberInput.value);
  var humidity = parseFloat(humidityInput.value);
  var Ftemperature = celsius * 1.8 + 32; //chceck if inputs are right

  var check = checkInputs(Ftemperature, humidity);

  if (check == 0) {
    resultOutput.innerHTML = '';
    return;
  }

  var result = heatIndex(Ftemperature, humidity);
  result = (result - 32) * 0.555;
  result = Math.floor(result);

  if (celsius && humidity) {
    localStorage.setItem("temperature: ".concat(celsius, "\xB0C, humidity: ").concat(humidity, "%"), "Heat Index: ".concat(result, "\xB0C")); //location.reload();
  }

  resultOutput.innerHTML = "<p>Heat Index:<br><span>".concat(result, "\xB0C</span><p>");
});
var FahrenheitNumberInput = document.getElementById('fahrenheitNumber');
var humidityInputF = document.getElementById('humidityF');
var submitButtonF = document.querySelector('.submitButtonF');
var resultOutputF = document.querySelector('.resultF');
submitButtonF.addEventListener('click', function () {
  var fahrenheit = parseFloat(FahrenheitNumberInput.value);
  var humidity = parseFloat(humidityInputF.value); //chceck if inputs are right

  var check = checkInputs(fahrenheit, humidity);

  if (check === 0) {
    resultOutputF.innerHTML = '';
    return;
  }

  var result = heatIndex(fahrenheit, humidity);
  result = Math.floor(result);
  resultOutputF.innerHTML = "<p>Heat Index:<br><span>".concat(result, "\xB0F</span><p>");
});
/* 
    functions
*/
//function returning string for weather state

function weatherState(weatherNumber) {
  switch (weatherNumber) {
    case 0:
      tempWeather = 'Clear sky';
      break;

    case 1:
    case 2:
    case 3:
      tempWeather = 'Mainly clear';
      break;

    case 48:
    case 45:
      tempWeather = 'Fog';
      break;

    case 51:
    case 53:
    case 55:
      tempWeather = 'Drizzle';
      break;

    case 56:
    case 57:
      tempWeather = 'Freezing Drizzle';
      break;

    case 61:
    case 63:
    case 65:
      tempWeather = 'Rain';
      break;

    case 66:
    case 67:
      tempWeather = 'Freezing Rain';
      break;

    case 71:
    case 73:
    case 75:
      tempWeather = 'Snow fall';
      break;

    case 77:
      tempWeather = 'Snow grains';
      break;

    case 80:
    case 81:
    case 82:
      tempWeather = 'Rain showers';
      break;

    case 85:
    case 86:
      tempWeather = 'Snow showers';
      break;

    case 95:
    case 96:
    case 99:
      tempWeather = 'Thunderstorm';
      break;
  }

  return tempWeather;
} //create and return of the charts


function getChart(date, temperature, element) {
  var myDailyChart = document.getElementById(element).getContext("2d");
  var lineChart = new Chart(myDailyChart, {
    type: 'bar',
    //horizontal bar
    data: {
      labels: date,
      datasets: [{
        label: 'Temperature in Celsius',
        data: temperature,
        backgroundColor: '#d0bdf4'
      }]
    },
    Options: {}
  });
  return lineChart;
} //average temperature


function averageTemp(max, min) {
  var temp = (max + min) / 2;
  return temp;
} // function for checking if inputs are right


function checkInputs(temperature, humidity) {
  if (!temperature || !humidity) {
    alert('Please write both values');
    resultOutput.innerHTML = '';
    return 0;
  }

  if (temperature <= '80') {
    alert('Please write higher value than 26.6 C or 80 F');
    resultOutput.innerHTML = '';
    return 0;
  }

  if (humidity < 0 && humidity > 100) {
    alert('Please write humidity between 0-100 ');
    resultOutput.innerHTML = '';
    return 0;
  }

  return 1;
} // function returning heat index


function heatIndex(temp, hum) {
  var res = -42.379 + 2.04901523 * temp + 10.14333127 * hum - 0.22475541 * temp * hum - 6.83783 * 0.001 * temp * temp - 5.481717 * 0.01 * hum * hum + 1.22874 * 0.001 * temp * temp * hum + 8.5282 * 0.0001 * temp * hum * hum - 1.99 * 0.000001 * temp * temp * hum * hum;
  return res;
}