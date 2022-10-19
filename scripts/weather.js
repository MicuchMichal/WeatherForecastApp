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
const months = {
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
  11: "Dec",
}

const api = "https://api.open-meteo.com/v1/forecast?latitude=51.5002&longitude=-0.1262&hourly=temperature_2m,relativehumidity_2m,weathercode,surface_pressure&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max&timezone=Europe%2FLondon";
const apiHistory = "https://api.open-meteo.com/v1/forecast?latitude=51.5002&longitude=-0.1262&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max&timezone=Europe%2FLondon&past_days=7";
/* 
    buttons
*/
const hourlyForecast = document.querySelector('.hourlyForecast');
const threeDaysForecast = document.querySelector('.threeDaysForecast');
const sevenDaysForecast = document.querySelector('.sevenDaysForecast');
const historyWeather = document.querySelector('.historyWeather');

const inputData = document.querySelector('.tableContent');

/* 
    hourly data
*/
fetch(api)
.then(response =>{
  return response.json();
})
.then(data =>{
  let hourlyData = [];
  let hourlyChartDate = [];
  let hourlyChartTemp = [];
  hourlyData.push(`
    <li class="tableHeader">
      <span class="time">Time</span> 
      <span>Temp.</span>
      <span>Weather</span> 
      <span>Hum.</span> 
      <span>Pressure</span>
    </li>`)

  for (let i = 0; i < 48; i++){
    //date extraction
    let temp = data.hourly.time[i];
    let outputMonth = temp.substring(5,7);
    outputMonth = months[outputMonth-1];
    let outputDay = temp.substring(8,10);
    let outputHour = temp.substring(11);
    //data for charts
    hourlyChartDate[i] = `${outputDay} ${outputMonth} ${outputHour}`;
    hourlyChartTemp[i] = data.hourly.temperature_2m[i];
    //weather condition from function
    var tempWeather = weatherState(data.hourly.weathercode[i]);

    hourlyData.push(`
      <li>
        <span class="time">${outputDay}.${outputMonth} ${outputHour}</span> 
        <span class="temperature">${data.hourly.temperature_2m[i]}&#x2103</span>
        <span class="weather">${tempWeather}</span> 
        <span class="humidity">${data.hourly.relativehumidity_2m[i]}%</span> 
        <span class="pressure">${data.hourly.surface_pressure[i]} hpa</span>
      </li>`)
  }

  //convert to string to delete commas
  hourlyData = hourlyData.join("");
  //onload function to show loading page data
  window.onload = inputData.innerHTML = `${hourlyData}`
  //hourly forecast button eventlistenet
  hourlyForecast.addEventListener('click', function(){
    inputData.innerHTML = `${hourlyData}`
  })

/* 
    hourly chart
*/
  let lineDailyChart = getChart(hourlyChartDate,hourlyChartTemp, 'hourlyChart');
  
/* 
    3 days data
*/
  let threedaysData = [];
  let threedaysChartDate = [];
  let threedaysChartTemp = [];

  threedaysData.push(`
    <li class="tableHeader">
      <span class="time">Time</span> 
      <span>Temp.</span>
      <span>Weather</span> 
      <span>Hum.</span> 
      <span>Pressure</span>
    </li>`)

  for (let i = 0; i < 72; i+=6){
    //date extraction
    let temp = data.hourly.time[i];
    let outputMonth = temp.substring(5,7);
    outputMonth = months[outputMonth-1];
    let outputDay = temp.substring(8,10);
    let outputHour = temp.substring(11);
    //data for charts
    threedaysChartDate[i] = `${outputDay} ${outputMonth} ${outputHour}`;
    threedaysChartTemp[i] = `${data.hourly.temperature_2m[i]}`;
    //weather condition
    var tempWeather = weatherState(data.hourly.weathercode[i]);

    threedaysData.push(`
      <li>
        <span class="time">${outputDay}.${outputMonth} ${outputHour}</span> 
        <span class="temperature">${data.hourly.temperature_2m[i]}&#x2103</span>
        <span class="weather">${tempWeather}</span> 
        <span class="humidity">${data.hourly.relativehumidity_2m[i]}%</span> 
        <span class="pressure">${data.hourly.surface_pressure[i]} hpa</span>
      </li>`)
  }
  threedaysData = threedaysData.join("");

  threeDaysForecast.addEventListener('click', function(){
    inputData.innerHTML = `${threedaysData}`
  })
/* 
    3 days chart
*/
  let threedaysChart = getChart(threedaysChartDate,threedaysChartTemp, 'threedaysChart');
/* 
    7 days data
*/
  let dailyData = [];
  let sevendaysChartDate = [];
  let sevendaysChartTemp = [];

    dailyData.push(`
      <li class="tableHeader">
        <span class="time">Time</span> 
        <span>Max Temp</span>
        <span>Min Temp</span> 
        <span>Weather</span> 
        <span>Max wind</span>
      </li>`)
    for (let i = 0; i < 7; i++){

      //date extraction
      let tempDaily = data.daily.time[i];
      let monthDaily = tempDaily.substring(5,7);
      monthDaily = months[monthDaily-1];
      let dayDaily = tempDaily.substring(8,10);
      let average = averageTemp(data.daily.temperature_2m_max[i], data.daily.temperature_2m_min[i]);
      
      //data for charts
      sevendaysChartDate[i] = `${dayDaily} ${monthDaily}`;
      sevendaysChartTemp[i] = `${average}`;

      //weather extraction 
      var tempWeatherDaily = weatherState(data.daily.weathercode[i]);

      dailyData.push(`
      <li>
        <span class="time">${dayDaily}. ${monthDaily}</span> 
        <span>${data.daily.temperature_2m_max[i]}&#x2103</span>
        <span>${data.daily.temperature_2m_min[i]}&#x2103</span> 
        <span>${tempWeatherDaily}</span> 
        <span>${data.daily.windspeed_10m_max[i]} km/h</span>
      </li>`)
    }
    dailyData = dailyData.join("");

    sevenDaysForecast.addEventListener('click', function(){
    inputData.innerHTML = `${dailyData}`
  })
/* 
    7 days chart
*/
  let sevenedaysChart = getChart(sevendaysChartDate, sevendaysChartTemp, 'sevendaysChart');
})

/* 
    history
*/
fetch(apiHistory)
.then(response =>{
  return response.json();
})
.then(data =>{
  let historyData = [];
  let historychartDate = [];
  let historyChartTemperature = [];
  historyData.push(`
    <li class="tableHeader">
      <span class="time">Time</span> 
      <span>Max Temp</span>
      <span>Min Temp</span> 
      <span>Weather</span> 
      <span>Max wind</span>
    </li>`)

    //console.log(data)
  for (let i = 0; i < 7; i++){

    //date extraction
    let tempHist = data.daily.time[i];
    let monthHist = tempHist.substring(5,7);
    monthHist = months[monthHist-1];
    let dayHist = tempHist.substring(8,10);
    let average = averageTemp(data.daily.temperature_2m_max[i], data.daily.temperature_2m_min[i]);
    //data for charts
    historychartDate[i] = `${dayHist} ${monthHist}`;
    historyChartTemperature[i] = `${average}`;

    //weather extraction 
    var tempWeatherHistory = weatherState(data.daily.weathercode[i]);

    historyData.push(`
    <li>
      <span class="time">${dayHist}. ${monthHist}</span> 
      <span>${data.daily.temperature_2m_max[i]}&#x2103</span>
      <span>${data.daily.temperature_2m_min[i]}&#x2103</span> 
      <span>${tempWeatherHistory}</span> 
      <span>${data.daily.windspeed_10m_max[i]} km/h</span>
    </li>`)
  }
    historyData = historyData.join("");

    historyWeather.addEventListener('click', function(){
      inputData.innerHTML = `${historyData}`
    })
    
/* 
  history chart
*/
  let historyChart = getChart(historychartDate, historyChartTemperature, 'historyChart');

/* 
    chart section interface
*/
const chartButtons = document.querySelectorAll('.chart-button');
const chartSection = document.querySelector('.chartSection');
const charts = document.querySelectorAll('.chartContent');

chartSection.addEventListener('click', function(event){
  const id = event.target.dataset.id;
  //console.log(id);
  if(id){
    chartButtons.forEach(function(button){
      button.classList.remove('activeButton');
      event.target.classList.add("activeButton");
    })
    charts.forEach(function(chart){
    chart.classList.remove('active');
    })
    const element = document.getElementById(id);
    element.classList.add('active');
  }
})

/* 
    calculator interface
*/
const calcButtons = document.querySelectorAll('.calc-button');
const calculatorSection = document.querySelector('.calculatorSection');
const calculator = document.querySelectorAll('.calculatorContent');

calculatorSection.addEventListener('click', function(event){
  const id = event.target.dataset.id;
  if(id){
    calcButtons.forEach(function(button){
      button.classList.remove('activeButton');
      event.target.classList.add('activeButton');
    })
    calculator.forEach(function(calc){
    calc.classList.remove('activeCalc');
    })
    const element = document.getElementById(id);
    element.classList.add('activeCalc');
  }
  })
});
/* 
    calculation
*/
const celsiusNumberInput = document.getElementById('celsiusNumber');
const humidityInput = document.getElementById('humidity');
const submitButton = document.querySelector('.submitButton');
var resultOutput = document.querySelector('.result');

submitButton.addEventListener('click', function(){
  let celsius = parseFloat(celsiusNumberInput.value);
  let humidity = parseFloat(humidityInput.value);
  let Ftemperature = (celsius*1.8) +32;
  //chceck if inputs are right
  let check = checkInputs(Ftemperature, humidity);
  if(check == 0){
    resultOutput.innerHTML = '';
    return;
  }
  let result = heatIndex(Ftemperature , humidity);
  result = (result - 32) * 0.555;
  result = Math.floor(result);

  if(celsius && humidity){
    localStorage.setItem(`temperature: ${celsius}°C, humidity: ${humidity}%`, `Heat Index: ${result}°C`);
    //location.reload();
  }
  
  resultOutput.innerHTML = `<p>Heat Index:<br><span>${result}°C</span><p>`;
})

const FahrenheitNumberInput = document.getElementById('fahrenheitNumber');
const humidityInputF = document.getElementById('humidityF');
const submitButtonF = document.querySelector('.submitButtonF');
var resultOutputF = document.querySelector('.resultF');

submitButtonF.addEventListener('click', function(){
  let fahrenheit = parseFloat(FahrenheitNumberInput.value);
  let humidity = parseFloat(humidityInputF.value);
  //chceck if inputs are right
  let check = checkInputs(fahrenheit, humidity);
  if(check === 0){
    resultOutputF.innerHTML = '';
    return;
  }
  let result = heatIndex(fahrenheit , humidity);
  result = Math.floor(result);

  resultOutputF.innerHTML = `<p>Heat Index:<br><span>${result}°F</span><p>`;
})

/* 
    functions
*/
//function returning string for weather state
function weatherState(weatherNumber) {
  switch (weatherNumber){
    case 0:
      tempWeather = 'Clear sky';
      break;
    case 1:case 2:case 3:
      tempWeather = 'Mainly clear';
      break;
    case 48:case 45:
      tempWeather = 'Fog';
      break;
    case 51:case 53:case 55:
      tempWeather = 'Drizzle';
      break;
    case 56:case 57:
      tempWeather = 'Freezing Drizzle';
      break;
    case 61:case 63:case 65:
      tempWeather = 'Rain';
      break;
    case 66:case 67:
      tempWeather = 'Freezing Rain';
      break;
    case 71:case 73:case 75:
      tempWeather = 'Snow fall';
      break;
    case 77:
      tempWeather = 'Snow grains';
      break;
    case 80:case 81:case 82:
      tempWeather = 'Rain showers';
      break;
    case 85:case 86:
      tempWeather = 'Snow showers';
      break;
    case 95:case 96:case 99:
      tempWeather = 'Thunderstorm';
      break;
  }
  return tempWeather;
}
//create and return of the charts
function getChart(date, temperature, element){
  let myDailyChart = document.getElementById(element).getContext("2d");

  let lineChart = new Chart(myDailyChart, {
    type: 'bar', //horizontal bar
    data: {
      labels: date,
      datasets:[{
        label: 'Temperature in Celsius',
        data: temperature,
        backgroundColor: '#d0bdf4',
      }],
    },
    Options: {},
  });
  return lineChart;
}
//average temperature
function averageTemp (max, min){
  let temp = (max + min) / 2;
  return temp
}
// function for checking if inputs are right
function checkInputs(temperature, humidity){
  if(!temperature || !humidity){
    alert('Please write both values');
    resultOutput.innerHTML = '';
    return 0;
  }
  if(temperature <= '80'){
    alert('Please write higher value than 26.6 C or 80 F');
    resultOutput.innerHTML = '';
    return 0;
  }
  if(humidity < 0 && humidity > 100){
    alert('Please write humidity between 0-100 ');
    resultOutput.innerHTML = '';
    return 0;
  }
  return 1;
}
// function returning heat index
function heatIndex(temp, hum){
  let res = -42.379 + 2.04901523 * temp + 10.14333127 * hum
  - 0.22475541 * temp * hum - 6.83783 * 0.001 * temp * temp
  - 5.481717 * 0.01 * hum * hum + 1.22874 * 0.001 * temp* temp * hum
  + 8.5282 * 0.0001 * temp * hum*hum - 1.99 * 0.000001 * temp * temp * hum*hum
  return res;
}

