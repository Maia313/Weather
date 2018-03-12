const ipinfo = "https://ipinfo.io";
const proxy = "https://crossorigin.me/";
const dsAPI = "https://api.darksky.net/forecast/7535a35daa4bf7d1231073bae0263e0c/";
const options = "?units=auto&extend=hourly";

let geolocation;
let weather;
let hourlyWeatherHeights;

init();
//Get geolocation and initialize now,daily, and hourly div
function init() {
    $.getJSON(ipinfo, function(geolocationData) {
        console.log(geolocationData);
        geolocation = geolocationData;
        //initGeolocationDiv();

        $.getJSON(proxy + dsAPI + getLatLong() + options, function(weatherData) {
            weather = weatherData;
            initNowDiv();
            initWeatherDailyDiv();
            initWeatherHourlyDiv();
            console.log(weather);
        });


    });
}


function getLatLong() {
    if (!geolocation) {
        console.error("No GeoLocation Data");
    }
    return geolocation.loc;
}


//Weather Now
function initNowDiv() {
    var d = new Date();
    var time = d.getHours();
    $("#now").html(
        `<h2> Now, </h2><h3>${time}h</h3>
        <h2>${round(weather.hourly.data[0].temperature, 0)}&deg</h2><br>
        <img src='img/clouds.svg'>
        <h3>${weather.currently.summary}</h3>`
    );
}


//Weather Daily 
function initWeatherDailyDiv() {
    for (let i = 0; i < 7; i++) {
        renderWeatherDayDiv(i);
    }
    initWeatherDailyEventListener();
}

function renderWeatherDayDiv(index) {
    let tempMax = round(weather.daily.data[index].apparentTemperatureMax, 0);
    let tempMin = round(weather.daily.data[index].apparentTemperatureMin, 0);
    let descrip = weather.daily.data[index].icon;
    let ms = weather.daily.data[index].time;
    let day = getDayOfWeek(ms);

    $("#day" + index).html(
        `<h2>${day }</h2><br>
        <h3> ${tempMax}&deg /${tempMin}&deg</h3>
        ${getWeatherImg()}
        <h3>${descrip}</h3>`
    );

    function getWeatherImg() {
        if (descrip == "rain")
            return "<img src='img/humidity.svg'>";
        else if (descrip == "partly-cloudy-day")
            return "<img src='img/cloud.svg'>";
        else if (descrip == "partly-cloudy-night")
            return "<img src='img/cloud.svg'>";
        else if (descrip == "cloudy")
            return "<img src='img/clouds.svg'>";
        else if (descrip == "snow")
            return "<img src='img/snow.svg'>";
        else if (descrip == "sunny")
            return "<img src='img/sunny.svg'>";
    }

}

//Add event listeners to all 7 weather-days
function initWeatherDailyEventListener() {
    for (let i = 0; i < 7; i++) {
        const j = i;
        $("#day" + j).on("click", function() {
            select(j);
        });
    }
}


//Unselect a weather-day div and then select a weather-day div
function select(index) {
    console.log(`select(${index})`);
    $(".selected").removeClass("selected");
    $(`#day${index}`).addClass("selected");
    renderWeatherHourlyDiv(index);
}

//Weather Hourly
function initWeatherHourlyDiv() {
    let tempMax = Number.MIN_VALUE;
    let tempMin = Number.MAX_VALUE;

    hourlyWeatherHeights = new Array(168);

    for (let i = 0; i < 168; i++) {
        let temp = weather.hourly.data[i].temperature;
        if (temp > tempMax) {
            tempMax = temp;
        }
        if (temp < tempMin) {
            tempMin = temp;
        }
    }
    for (let i = 0; i < 168; i++) {
        temp = weather.hourly.data[i].temperature;
        hourlyWeatherHeights[i] = 120 * (temp - tempMin) / (tempMax - tempMin);
    }
    select(0);
}

function renderWeatherHourlyDiv(index) {

    for (let i = 0; i < 24; i++) {
        renderGraphColumn(i, i + getDayIndex(index));
    }
}

function renderGraphColumn(colIndex, index) {
    let temp = round(weather.hourly.data[index].temperature, 0);
    let time = getHour(weather.hourly.data[index].time);
    let height = hourlyWeatherHeights[index];
    $("#col" + colIndex).html(
        `<p>${temp}</p>
        <div class='bar shadow' style='height:${height}'></div>
        <p>${time}<br>`
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
    let dateNr = date.getDate();

    let month = date.getMonth();
    let today = (new Date).getDay();

    if (day == today) {
        return "Today, " + "<br>" + "<h4>" + dateNr + " " + monNames[month] + "</h4>";

    }
    return weekdays[day] + "," + "<br>" + "<h4>" + dateNr + " " + monNames[month] + "</h4>";

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

function getDayIndex(index) {
    if (index === 0) {
        return 0;
    }
    let dt = new Date(weather.hourly.data[index * 24].time);
    let hour = dt.getHours() - 1;

    return index * 24 - hour;
}

// round a number to specified decimal places
function round(number, place) {
    let modifier = Math.pow(10, place);
    return Math.round(number * modifier) / modifier;
}
