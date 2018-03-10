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
        "<h3>" + round(currentlyWeather.temperature, 0) + "&deg" + "</h3><br>" +
        "<img src='img/clouds.svg'>" +
        "<h3>" + currentlyWeather.icon + "</h3>";
}

/*function displayTodayWeather(todayWeather) {
    //console.log('todayWeather......................', todayWeather);
    console.log('innerHTML..........', document.getElementById('now').innerHTML);
    let ms = todayWeather.time;
    let day = getDayDate(ms);
    document.getElementById('day0').innerHTML =
        "<h2>" + day + "</h2><br>" + "<h3>" + round(todayWeather.temperature, 0) + "&deg" + "</h3><br>" +
        "<img src='img/clouds.svg'>" +
        "<h3>" + todayWeather.icon + "</h3>";
}*/

function displayDailyWeather(index, dailyWeather) {
    console.log('dailyWeather......................', dailyWeather[index]);
    let tempMax = round(dailyWeather[index].apparentTemperatureMax, 0);
    let tempMin = round(dailyWeather[index].apparentTemperatureMin, 0);
    let ms = dailyWeather[index].time;
    let day = getDayDate(ms);
    const daydiv = document.getElementById('day');
    (daydiv + index).innerHTML =
        "<h2>" + day + "</h2><br>" + "<h3>" + tempMax + "&deg / " + tempMin + "&deg" + "</h3>" +
        "<img src='img/clouds.svg'>" +
        "<h3>" + dailyWeather[index].icon + "</h3>";

}

function displayHourlyWeather(hourlyWeather) {
    //console.log('hourlyWeather......................', hourlyWeather);
}

function displayWeatherData(weatherData) {
    displayNowWeather(weatherData.currently);
    for (let i = 0; i < 7; i++) {
        displayDailyWeather(i, weatherData.daily.data);
    }
    //displayTodayWeather(weatherData.daily.data[0]);
    //displayDailyWeather(weatherData.daily.data.slice(1, weatherData.daily.data.length));
    displayHourlyWeather(weatherData.hourly.data.slice(0, 24));

}

function init() {
    //const newLocation = '';
    console.log('Start');
    //return getCityName
    return getCurrentCoordinates()
        .then(currentLocation => {
            // return getWeather(newLocation || currentLocation.loc);
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

// round a number to specified decimal places
function round(number, place) {
    let modifier = Math.pow(10, place);
    return Math.round(number * modifier) / modifier;
}

function getDayDate(time) {
    let weekdays = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
    ];
    let monNames = ["January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    let date = new Date(time * 1000);
    let day = date.getDay();


    let month = date.getMonth();
    let today = (new Date).getDay();

    if (day == today) {
        return "Today, " + "<br>" + "<h4>" + day + " " + monNames[month] + "</h4>";

    }
    return weekdays[day] + "," + "<br>" + "<h4>" + day + " " + monNames[month] + "</h4>";
}