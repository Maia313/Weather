const searchCity = document.getElementById('city-search');

//document.addEventListener('DOMContentLoaded', init());
searchCity.addEventListener('change', () => {
    const searchValue = searchCity.value;
    init(searchValue);
});


function init() {
    const ipinfo = "https://ipinfo.io";
    const proxy = "https://crossorigin.me/";
    const dsAPI = "https://api.darksky.net/forecast/7535a35daa4bf7d1231073bae0263e0c/";
    const options = "?units=auto&extend=hourly";
    return fetch(ipinfo)
        .then(geolocationData => {
            return fetch(proxy + dsAPI + getLatLong(geolocationData) + options);
        })
        .then(weatherData => {
            initNowDiv(weatherData);
            initWeatherDailyDiv(weatherData);
            initWeatherHourlyDiv(weatherData);
            //console.log(weatherData);
        });
}


function getLatLong(geolocation) {
    if (!geolocation) {
        console.error("No GeoLocation Data");
    }
    return geolocation.loc;
}


//Weather Now
function initNowDiv(weatherData) {

    document.getElementById("#now").innerHTML(
        "<br><h2> Now </h2>" +
        "<h3>" + round(weatherData.hourly.data[0].temperature, 0) + "&deg" + "</h3><br>" +
        "<img src='img/clouds.svg'>" +
        "<h3>" + weatherData.currently.summary + "</h3>"
    );
}


//Weather Daily 
function initWeatherDailyDiv(weatherData) {
    for (let i = 0; i < 7; i++) {
        renderWeatherDayDiv(i, weatherData);
    }
    initWeatherDailyEventListener();
}

function renderWeatherDayDiv(index, weatherData) {
    let tempMax = round(weatherData.daily.data[index].apparentTemperatureMax, 0);
    let tempMin = round(weatherData.daily.data[index].apparentTemperatureMin, 0);
    let descrip = weatherData.daily.data[index].icon;
    let ms = weatherData.daily.data[index].time;
    let day = getDayOfWeek(ms);

    const daydiv = document.getElementById("#day");
    (daydiv + index).innerHTML(
        "<h2>" + day + "</h2><br>" +
        "<h3>" + tempMax + "&deg / " + tempMin + "&deg" + "</h3>" +
        getWeatherImg() +
        "<h3>" + descrip + "</h3>"
    );

    function getWeatherImg() {
        if (descrip == "rainy")
            return "<img src='img/humidity.svg'>";
        else if (descrip == "partly-cloudy-day")
            return "<img src='img/cloud.svg'>";
        else if (descrip == "cloudy")
            return "<img src='img/clouds.svg'>";
        else if (descrip == "snow")
            return "<img src='img/snow.svg'>";
        else if (descrip == "clear-day")
            return "<img src='img/sunny.svg'>";
        else if (descrip == "wind")
            return "<img src='img/wind.svg'>";
        else if (descrip == "wind")
            return "<img src='img/flag.svg'>";
        else if (descrip == "fog")
            return "<img src='img/flag.svg'>";
    }

}

// add event listeners to all 7 weather-days
function initWeatherDailyEventListener(daydiv) {
    for (let i = 0; i < 7; i++) {
        const j = i;
        (daydiv + j).addEventListener("click", function() {
            select(j);
        });
    }
}


// Unselect a weather-day div and then select a weather-day div
function select(index, daydiv) {
    console.log("select(" + index + ")");
    document.getElementsByClassName(".selected").className.remove("selected");
    (daydiv + index).className.add("selected");
    renderWeatherHourlyDiv(index);
}

//Weather Hourly

function initWeatherHourlyDiv(weatherData) {
    let tempMax = Number.MIN_VALUE;
    let tempMin = Number.MAX_VALUE;

    let hourlyWeatherHeights = new Array(168);

    for (let i = 0; i < 168; i++) {
        let temp = weatherData.hourly.data[i].temperature;
        if (temp > tempMax) {
            tempMax = temp;
        }
        if (temp < tempMin) {
            tempMin = temp;
        }
    }
    for (let i = 0; i < 168; i++) {
        temp = weatherData.hourly.data[i].temperature;
        hourlyWeatherHeights[i] = 120 * (temp - tempMin) / (tempMax - tempMin);
    }
    select(0);
}

function renderWeatherHourlyDiv(index) {

    for (var i = 0; i < 24; i++) {
        renderGraphColumn(i, i + getDayIndex(index));
    }
}

function renderGraphColumn(colIndex, index, weatherData) {
    let temp = round(weatherData.hourly.data[index].temperature, 0);
    let time = getHour(weatherData.hourly.data[index].time);
    let height = hourlyWeatherHeights[index];
    let column = document.getElementById("#col");
    (column + colIndex).innerHTML(
        "<p>" + temp + "</p>" +
        " <div class='bar shadow' style='height:" + height + "'></div>" +
        "<p>" + time + "<br>"
    );
}

//Date Helpers 

// input:  Time in Seconds
// output: Day of the week as a string
function getDayOfWeek(time) {
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

function getHour(time) {
    let date = new Date(time * 1000);
    time = date.getHours();
    if (time < 10) {
        time = "0" + time;
    }
    time += ":00";
    return time;
}

function getDayIndex(index, weatherData) {
    if (index === 0) {
        return 0;
    }
    let dt = new Date(weatherData.hourly.data[index * 24].time);
    let hour = dt.getHours() - 1;

    return index * 24 - hour;
}

// round a number to specified decimal places
function round(number, place) {
    let modifier = Math.pow(10, place);
    return Math.round(number * modifier) / modifier;
}


function insertGoogleScript() {
    let google_api = document.createElement('script'),
        api_key = 'AIzaSyBoElUerTGDfw9nkaF5LT0gWLzDljxr4CA ';

    google_api.src = 'https://maps.googleapis.com/maps/api/js?key=' + api_key + '&callback=initGoogleAPI&libraries=places,geometry';
    document.body.appendChild(google_api);
}


// SearchBox Method
function initGoogleAPI() {
    let autocomplete = new google.maps.places.SearchBox(document.getElementById("#city-search"));

    autocomplete.addListener('places_changed', function() {
        var place = autocomplete.getPlaces()[0];
        document.querySelector("#latitude").value = place.geometry.location.lat();
        document.querySelector("#longitude").value = place.geometry.location.lng();
    });
}

insertGoogleScript();