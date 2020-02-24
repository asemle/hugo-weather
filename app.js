

const weather = {};

weather.temperature = {
    unit: "celsius"
}


const KELVIN = 273;

const key = "82005d27a116c2880c8f0fcb866998a0";

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!

var yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd;
}
if (mm < 10) {
    mm = '0' + mm;
}
var today = mm + '/' + dd + '/' + yyyy;


$(document).ready(function() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;

            getWeather(latitude, longitude);

        }, function() {
            alert("error")
        }
        );

    } else {
        alert("no location support")
    }
})

// GET WEATHER FROM API 
function getWeather(latitude, longitude) {
    let currenturl = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    let forecasturl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}`;

    $.ajax({
        url: currenturl,
        method: "GET"
    }).done(function(response) {
        console.log(response)
        let current = response;

        let heading = `<h2>${current.name} ${today} <i class="fas ${current.weather[0].main === "Clear" ? 'fas-sun' : 'fas-cloud'}"/></h2>`
        let temp = `<p>Temperature: ${celsiusToFahrenheit(current.main.temp - KELVIN)} &#176F</p>`;

        let humidity = `<p>Humidity: ${current.main.humidity}%</p>`

        let wind = `<p>Wind Speed: ${current.wind.speed} MPH</p>`

        $(".current").append(heading, temp, humidity, wind)
    });

    $.ajax({
        url: forecasturl,
        method: "GET"
    }).done(function (response) {
        console.log(response)
        let forecast = response;

        for(var i = 0; i < 40; i += 8) {

            let date = forecast.list[i].dt_txt.split(" ")[0]
            date = `<h3>${date}</h3>`;

            let temp = `<p>${celsiusToFahrenheit(forecast.list[i].main.temp - KELVIN).toFixed(2)} &#176F</p>`;
            let humidity = `<p>${forecast.list[i].main.humidity}%</p>`

            $(".forecast").append(`<div>${date} ${temp} ${humidity}</div>`)
        }
        
    });

}

// C to F 
function celsiusToFahrenheit(temperature) {
    return (temperature * 9 / 5) + 32;
}

