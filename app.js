// SET DOMS
const searchBtn = document.querySelector('.search-btn');
const locationBtn = document.querySelector('location-btn');
const weatherCardDivs  = document.querySelector('.weather-cards');
const currentWeatherDiv  = document.querySelector('.current-weather');
const cityInput = document.querySelector('.city-input');

const API_KEY = '51c04fd515b2e1c7d6f475beee32c9cc';  // API key for OpenWeatherMap API


const createWeatherCard = (cityName, weatherItem, index) =>{
    if (index === 0){   //HTML FOR THE MAIN CARD
        return `
                <div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split('')[0]})</h2>
                    <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}*C</h4>
                    <h4>Wind:  ${weatherItem.wind.speed}M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4> 
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}4x.png">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;

    }else{      //HTML FOR THE 5 DAYS CARD
        return ` <li class="card">
                    <h3>${weatherItem.dt_txt}</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}2x.png" alt="weather-icon">
                    <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}*C</h4>
                    <h4>Wind:  ${weatherItem.wind.speed}M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </li> `;
    }
}
 
const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {        
        //filter the forecast to get only one daY
        
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            } 

        });

        // Clearing previous weather data (predefined)
        cityInput.value = '';
        currentWeatherDiv.innerHTML  = '';
        weatherCardDivs.innerHTML = '';

        // console.log(fiveDaysForecast);
        // CREATING WEATHER CARD AND ADDING THEM TO DOM
        fiveDaysForecast.forEach((weatherItem, index) => {
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML('beforeend', createWeatherCard(cityName, weatherItem, index));
            } else {
                weatherCardDivs.insertAdjacentHTML('beforeend', createWeatherCard(cityName, weatherItem, index));
            }
    
                
        })


    }).catch(() => {
        alert('An error occured while fetching the weather forecast!')
    });
}
 

const getCityCoordinates = () =>{
    const cityName= cityInput.value.trim(); //Get user entered city name and remove extraspace
    if (!cityName) return;  //Return if cityName is empty

    // console.log(cityName);
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    // // Get entered city coordinates(latitude, longitude and name) from the API response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        // console.log(data)
        if (!data.length) return alert(`No coordinates found for ${cityName}`) 
        const { name, lat, lon  } = data [0] ;
        getWeatherDetails(name, lat, lon  );
    
    }).catch(() => {
        alert('An error occured while fetching the coordinates')
    });
}

 
const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude} = position.coords 
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;


            // Get city from coordinates using reverse geocoding API
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                // console.log(data);
                const { name } = data [0] ;
                getWeatherDetails(name, latitude, longitude );
            
            }).catch(() => {
                alert('An error occured while fetching the city')
            });

        },
        error =>{
            if (error.code === error.PERMISSION_DENIED) {
                alert('Geolocation request denied. please reset location permisssion to grant acess again.')
            }
        }
    );
}

// locationBtn.addEventListener('click', getUserCoordinates);
// locationBtn.addEventListener("click", getUserCoordinates);
searchBtn.addEventListener('click', getCityCoordinates);
cityInput.addEventListener('keyup', e => e.key === "Enter" && getCityCoordinates)