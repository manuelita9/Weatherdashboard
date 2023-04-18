// Get DOM elements
const searchBtn = document.getElementById("searchBtn");
const historyContainer = document.getElementById("history");
const searchInput = document.getElementById("searchInput");
const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

// OpenWeatherMap API key
const apiKey = "ae8dc33d91f6926ff7f6df500e291f80";

// Fetch weather data from OpenWeatherMap API
async function getCity() {

}
  const city = searchInput.value;
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  try {
    const currentResponse = await fetch(currentUrl);
    const currentData = await currentResponse.json();
    console.log(currentData);
    displayCurrentWeather(currentData);
    saveToLS(currentData);

    $(".historyBtn").remove();
    createHistoryBtn();

    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();
    console.log(forecastData);
    $(".removeRow").remove();
    displayForecastWeather(forecastData);
  } catch (error) {
    console.error(error);
  }
}

// Display current weather data
function displayCurrentWeather(data) {
  const kelvin = data.main.temp;
  const fahrenheit = 1.8 * (kelvin - 273) + 32;
  const iconCode = data.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
  cityName.textContent = `${data.name} ${dayjs().format("ddd MM/DD/YYYY")}`;
  temp.textContent = `Temperature: ${fahrenheit.toFixed(2)} °F`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  wind.textContent = `Wind: ${data.wind.speed} MPH`;
  $("#weatherIcon").attr("src", iconUrl);
}

// Display forecast weather data
function displayForecastWeather(data) {
  for (let i = 6; i <= 38; i += 8) {
    const kelvin = data.list[i].main.temp;
    const fahrenheit = 1.8 * (kelvin - 273) + 32;
    const iconCode = data.list[i].weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

    const dateEl = document.createElement("li");
    const iconEl = document.createElement("img");
    const tempEl = document.createElement("li");
    const windEl = document.createElement("li");
    const humidityEl = document.createElement("li");

    dateEl.setAttribute("class", "removeRow");
    iconEl.setAttribute("class", "removeRow");
    tempEl.setAttribute("class", "removeRow");
    windEl.setAttribute("class", "removeRow");
    humidityEl.setAttribute("class", "removeRow");

    const dateString = data.list[i].dt_txt;
    const date = moment(dateString);

    dateEl.textContent = date.format("ddd MM/DD/YYYY");
    iconEl.setAttribute("src", iconUrl);
    tempEl.textContent = `Temperature: ${fahrenheit.toFixed(2)} °F`;
    windEl.textContent = `Wind: ${data.list[i].wind.speed} MPH`;
    humidityEl.textContent = `Humidity: ${data.list[i].main.humidity}%`;

$(`#forecast${i}`).append(dateEl);
