var searchBtn = document.getElementById("searchBtn");
var historyBtn = document.getElementById("historyBtn");
var historyContainer = document.getElementById("history");
var searchInput = document.getElementById("searchInput");
var apiKey = "ae8dc33d91f6926ff7f6df500e291f80";
var cityName = document.getElementById("cityName");
var temp = document.getElementById("temp");
var humidity = document.getElementById("humidity");
var wind = document.getElementById("wind");
// Functions
// This uses server-side API's to grab information from other websites for weather info for different Cities
function getCity() {
    var city = searchInput.value;
    var currentUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      apiKey;
    var forecastUrl =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&appid=" +
      apiKey;

      fetch(currentUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        displayCurrentWeather(data);
        saveToLS(data);
        $(".historyBtn").remove();
        createHistoryBtn();
      });
  
    fetch(forecastUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        $(".removeRow").remove();
        displayForecastWeather(data);
      });
  }
  // This takes the information gathered by server side APIs and shows it more legibly , also converts Kelvin to Fahrenheit
  function displayCurrentWeather(data) {
    let kelvin = data.main.temp;
    let fahrenheit = 1.8 * (kelvin - 273) + 32;
    let iconCode = data.weather[0].icon;
    let iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    cityName.textContent = data.name + " " + dayjs().format("ddd MM/DD/YYYY");
    temp.textContent = "Temperature: " + fahrenheit.toFixed(2) + " °F";
    humidity.textContent = "Humidity: " + data.main.humidity + "%";
    wind.textContent = "Wind: " + data.wind.speed + " MPH";
    $("#weatherIcon").attr("src", iconUrl);
  }
  // This takes the server side information gathered by server side APIs. shows it legibly, dynamically adds elements"
  function displayForecastWeather(data) {
    for (i = 6; i <= 38; i += 8) {
      let kelvin = data.list[i].main.temp;
      let fahrenheit = 1.8 * (kelvin - 273) + 32;
      let iconCode = data.list[i].weather[0].icon;
      let iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
  
      let dateEl = document.createElement("li");
      let iconEl = document.createElement("img");
      let tempEl = document.createElement("li");
      let windEl = document.createElement("li");
      let humidityEl = document.createElement("li");
  
      dateEl.setAttribute("class", "removeRow");
      iconEl.setAttribute("class", "removeRow");
      tempEl.setAttribute("class", "removeRow");
      windEl.setAttribute("class", "removeRow");
      humidityEl.setAttribute("class", "removeRow");
  
      let dateString = data.list[i].dt_txt;
      let date = moment(dateString);
  
      dateEl.textContent = date.format("ddd MM/DD/YYYY");
      iconEl.setAttribute("src", iconUrl);
      tempEl.textContent = "Temperature: " + fahrenheit.toFixed(2) + " °F";
      windEl.textContent = "Wind: " + data.list[i].wind.speed + " MPH";
      humidityEl.textContent = "Humidity: " + data.list[i].main.humidity + "%";
  
      $("#forecast" + i).append(dateEl);
      $("#forecast" + i).append(iconEl);
      $("#forecast" + i).append(tempEl);
      $("#forecast" + i).append(windEl);
      $("#forecast" + i).append(humidityEl);
    }
  }
  // This is to save information on local storage
  function saveToLS(data) {
    localStorage.setItem(data.name, data.name);
  }
  // This creates a button to show cities you've previously searched
  function createHistoryBtn() {
    for (var i = 0; i < localStorage.length; i++) {
      const btn = document.createElement("button");
      btn.setAttribute("class", "historyBtn btn btn-light");
      btn.setAttribute("id", localStorage.getItem(localStorage.key(i)));
      btn.innerHTML = localStorage.getItem(localStorage.key(i));
      historyContainer.appendChild(btn);
    }
  }
  
  // Event Listeners
  historyContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("historyBtn")) {
      searchInput.value = e.target.innerHTML;
      getCity();
    }
  });
  
  searchBtn.addEventListener("click", getCity);