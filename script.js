const IPINFO_API = "https://ipinfo.io";
const PROXY_SERVICE = "https://crossorigin.me/";
const WEATHER_API = "https://api.darksky.net/forecast/7535a35daa4bf7d1231073bae0263e0c/";
const OPTIONS = "?units=auto&extend=hourly";

var geolocation;
var weather;
var hourlyWeatherHeights;
var input = "<br><input type='text' id='city'>";


$(document).ready(function() {
    init();
});

$("select#foo").val();

function init() {
    $.getJSON(IPINFO_API, function(geolocationData) {
        console.log(geolocationData);
        geolocation = geolocationData;
        initGeolocationDiv();

        $.getJSON(PROXY_SERVICE + WEATHER_API + getLatLong() + OPTIONS, function(weatherData) {
            weather = weatherData;
            initNowDiv();
            initWeatherDailyDiv();
            initWeatherHourlyDiv();
            console.log(weather);
        });


    });
}
//GeoLocation  

function initGeolocationDiv() {

    $("#geolocation").html(input + "<h2 class='city'>Weather in: <br>" + getCity() + ", " + getCountry() + "</h2>");

}

function getLatLong() {
    if (!geolocation) {
        console.error("No GeoLocation Data");
    }
    return geolocation.loc;
}

function getCity() {
    if (geolocation) {
        console.error("No GeoLocation Data");
    }
    return geolocation.city;

}

function getCountry() {
    if (geolocation) {
        console.error("No GeoLocation Data");
    }
    return geolocation.country;

}

//Weather Now
function initNowDiv() {

    $("#now").html(
        "<h2> Now </h2> <br>" +
        "<h3>" + round(weather.hourly.data[0].temperature, 0) + "&deg" + "</h3> <br>" +
        "<img src='img/clouds.svg'>" +
        "<h3>" + weather.currently.summary + "</h3>"
    );
}


//Weather Daily 
function initWeatherDailyDiv() {
    for (var i = 0; i < 7; i++) {
        renderWeatherDayDiv(i);
    }
    initWeatherDailyEventListener();
}

function renderWeatherDayDiv(index) {
    var tempMax = round(weather.daily.data[index].apparentTemperatureMax, 0);
    var tempMin = round(weather.daily.data[index].apparentTemperatureMin, 0);
    var descrip = weather.daily.data[index].icon;
    var ms = weather.daily.data[index].time;
    var day = getDayOfWeek(ms);

    $("#day" + index).html(
        "<h2>" + day + "</h2> <br>" +
        "<h3>" + tempMax + "&deg / " + tempMin + "&deg" + "</h3> <br>" +
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
        else if (descrip == "sunny")
            return "<img src='img/sunny.svg'>";
    }

}

// add event listeners to all 7 weather-days
// cannot do a loop due to the async calls
function initWeatherDailyEventListener() {
    for (var i = 0; i < 7; i++) {
        const j = i;
        $("#day" + j).on("click", function() {
            select(j);
        });
    }
}


// Unselect a weather-day div and then select a weather-day div
function select(index) {
    console.log("select(" + index + ")");
    $(".selected").removeClass("selected");
    $("#day" + index).addClass("selected");
    renderWeatherHourlyDiv(index);
}

//Weather Hourly

function initWeatherHourlyDiv() {
    var tempMax = Number.MIN_VALUE;
    var tempMin = Number.MAX_VALUE;

    hourlyWeatherHeights = new Array(168);

    for (var i = 0; i < 168; i++) {
        var temp = weather.hourly.data[i].temperature;
        if (temp > tempMax) {
            tempMax = temp;
        }
        if (temp < tempMin) {
            tempMin = temp;
        }
    }
    for (var i = 0; i < 168; i++) {
        temp = weather.hourly.data[i].temperature;
        hourlyWeatherHeights[i] = 120 * (temp - tempMin) / (tempMax - tempMin);
    }
    select(0);
}

function renderWeatherHourlyDiv(index) {

    for (var i = 0; i < 24; i++) {
        renderGraphColumn(i, i + getDayIndex(index));
    }
}

function renderGraphColumn(colIndex, index) {
    var temp = round(weather.hourly.data[index].temperature, 0);
    var time = getHour(weather.hourly.data[index].time);
    var height = hourlyWeatherHeights[index];
    $("#col" + colIndex).html(
        "<p>" + temp + "</p>" +
        " <div class='bar shadow' style='height:" + height + "'></div>" +
        "<p>" + time + "<br>"
    );
}

//Date Helpers 

// input:  Time in Seconds
// output: Day of the week as a string
function getDayOfWeek(time) {
    var weekdays = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
    ];
    var monNames = ["January",
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


    var date = new Date(time * 1000);
    var day = date.getDay();
    var dateNr = date.getDate();

    var month = date.getMonth();
    var today = (new Date).getDay();

    if (day == today) {
        return "Today, " + "<br>" + "<h4>" + dateNr + " " + monNames[month] + "</h4>";

    }
    return weekdays[day] + "," + "<br>" + "<h4>" + dateNr + " " + monNames[month] + "</h4>";

}

function getHour(time) {
    var date = new Date(time * 1000);
    time = date.getHours();
    if (time < 10) {
        time = "0" + time;
    }
    time += ":00";
    return time;
}

function getDayIndex(index) {
    if (index === 0) {
        return 0;
    }
    var dt = new Date(weather.hourly.data[index * 24].time);
    var hour = dt.getHours() - 1;

    return index * 24 - hour;
}



//Math Helpers 
// round a number to specified decimal places
function round(number, place) {
    var modifier = Math.pow(10, place);
    return Math.round(number * modifier) / modifier;
}

//