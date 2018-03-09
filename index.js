function getCurrentCoordinates() {
    return fetch('https://ipinfo.io/json')
        .then(response => {
            return response.json();
        });
}


function getWeather(currentLocation) {
    const proxy = "https://crossorigin.me/";
    const dsAPI = "https://api.darksky.net/forecast/7535a35daa4bf7d1231073bae0263e0c/";
    const options = "?units=auto&extend=hourly";
    return fetch(proxy + dsAPI + currentLocation + options)
        .then(response => {
            return response.json();
        });
}

function displayNowWeather(currentlyWeather) {
    //console.log('currentlyWeather......................', currentlyWeather);
    console.log('innerHTML..........', document.getElementById('now').innerHTML);
    document.getElementById('now').innerHTML =
        "<h2>Now</h2>" +
        "<h3>" + currentlyWeather.temperature + "&deg" + "</h3><br>" +
        "<img src='img/clouds.svg'>" +
        "<h3>" + currentlyWeather.summary + "</h3>";
}

function displayTodayWeather(todayWeather) {
    //console.log('todayWeather......................', todayWeather);
}

function displayDailyWeather(dailyWeather) {
    //console.log('dailyWeather......................', dailyWeather);
}

function displayHourlyWeather(hourlyWeather) {
    //console.log('hourlyWeather......................', hourlyWeather);
}

function displayWeatherData(weatherData) {
    displayNowWeather(weatherData.currently);
    displayTodayWeather(weatherData.daily.data[0]);
    displayDailyWeather(weatherData.daily.data.slice(1, weatherData.daily.data.length));
    displayHourlyWeather(weatherData.hourly.data.slice(0, 24));

}

function init() {
    console.log('Start');

    return getCurrentCoordinates()
        .then(currentLocation => {
            return getWeather(currentLocation.loc);
        })
        .then(weatherData => {
            return displayWeatherData(weatherData);
        })
        .catch(err => {
            console.log(err);
        });
}

init();