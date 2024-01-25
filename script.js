const cityinput = document.querySelector(".weather-input input");
const searchButton = document.querySelector(".search-btn");
const currentCardsDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const locationButton = document.querySelector(".location-btn");


const API_KEY = "1b517cee1cdff45d266ddaef95cb0991";

const createweatherCard = (cityName, weatherItem, index) => {
    if (index === 0) {
        return `<div class="details">
            <h2>${cityName}</h2>
            <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
            <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}</h4>
            <h4>Wind: ${weatherItem.wind.speed}M/S</h4>
            <h4>Humidity: ${weatherItem.main.humidity}%</h4>
        </div>
        <div class="icon">
            <img src="https://openweathermap.org/img/w/${weatherItem.weather[0].icon}.png" alt="weather-icon">
            <h4>${weatherItem.weather[0].description}</h4>
        </div>`;
    } else {
        return `<li class="card">
            <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
            <img src="https://openweathermap.org/img/w/${weatherItem.weather[0].icon}.png" alt="weather-icon">
            <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}</h4>
            <h4>Wind: ${weatherItem.wind.speed}M/S</h4>
            <h4>Humidity: ${weatherItem.main.humidity}%</h4>
        </li>`;
    }
};

const getWeatherDetails = (cityName ,  lat ,  lon , index) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    fetch( WEATHER_API_URL) .then(res => res.json()).then(data =>{
        const uniqueForcastDays = [];
        console.log(data);
         const fiveDaysForcast = data.list.filter(forecast =>{
            const forecastDate =  new Date (forecast.dt_txt).getDate();
            if(!uniqueForcastDays.includes(forecastDate)){
                return uniqueForcastDays.push(forecast);
            }
            
        });

        cityinput.value = "";
        weatherCardsDiv.innerHTML = "";
          console.log(fiveDaysForcast);
          for (let i = 0; i < 5; i++) {
            const weatherItem = fiveDaysForcast[i];
            if (index === 0) {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createweatherCard(cityName, weatherItem, index));
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createweatherCard(cityName, weatherItem, index));
            }
        }
        const currentWeatherItem = fiveDaysForcast[0]; 
        currentCardsDiv.innerHTML = createweatherCard(cityName, currentWeatherItem, index);
    })
    .catch(() => {
        alert("An error occurred while fetching the weather forecast");
    });
};

const getcitycoordinates = () => {

    const cityName = cityinput.value.trim();
    if(!cityName) return;
    const GEOCODING_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data =>{
        if(data.length ) return alert(`no coordinate found for ${cityName}`);
        const { name, coord: { lat, lon } } = data;

        getWeatherDetails( name ,  lat , lon );
    }).catch(() => {
       alert("an erroe occur while fetching the coordinate");
});
}

const getusercoordinate =  () =>{
    navigator.geolocation.getCurrentPosition(
     position => {
        const {latitude , longitude} = position.coords;
        const REVERSE_GEOCODING_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
        fetch(REVERSE_GEOCODING_API_URL).then(res => res.json()).then(data =>{
           const {name} = data[0];
            getWeatherDetails( name ,  latitude , longitude);
        }).catch(() => {
           alert("an erroe occur while fetching the city");
    });
     },
     error => {
       if(error.code === error.PERMISSION_DENIED){
        alert("Geolocation permissin denied please reset location permission to grant access");
       }
     }
    );
}



locationButton.addEventListener("click" , getusercoordinate);
searchButton.addEventListener("click" , getcitycoordinates);
cityinput.addEventListener("keyup", e => e.key === "Enter" &&  getcitycoordinates);