const apiKey = '12b861ab7d9039247d989600ad119bb7'; 
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeather(city);
        getForecast(city);
        document.getElementById('search-button').textContent = 'Weather Forecast';
    } else {
        alert('Please enter a city name.');
    }
});

function getWeatherIcon(description) {
    switch (description.toLowerCase()) {
        case 'clear sky':
            return '☀️';
        case 'few clouds':
            return '🌤️';
        case 'scattered clouds':
        case 'overcast clouds':
            return '☁️';
        case 'broken clouds':
            return '⛅'; 
        case 'shower rain':
        case 'rain':
        case 'light rain':
        case 'moderate rain':
            return '🌧️';
        case 'thunderstorm':
            return '⛈️';
        case 'snow':
            return '❄️';
        case 'mist':
            return '🌫️';
        default:
            return '🌡️';
    }
}

async function getWeather(city) {
    try {
        const response = await fetch(`${weatherApiUrl}?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (data.cod === 200) {
            const weatherIcon = getWeatherIcon(data.weather[0].description);
            document.getElementById('weather-info').innerHTML = `
                <h2>Weather in ${data.name}</h2>
                <div class="weather-details">
                    <span class="weather-icon">${weatherIcon}</span>
                    <div>
                        <p>${data.weather[0].description}</p>
                        <p>Temperature: ${data.main.temp} °C</p>
                        <p>Humidity: ${data.main.humidity}%</p>
                        <p>Wind Speed: ${data.wind.speed} m/s</p>
                    </div>
                </div>
            `;
        } else {
            document.getElementById('weather-info').innerHTML = `<p>City not found</p>`;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weather-info').innerHTML = `<p>Error fetching weather data</p>`;
    }
}

async function getForecast(city) {
    try {
        const response = await fetch(`${forecastApiUrl}?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (data.cod === '200') {
            let forecastHtml = '<h2 style="color: black;">5-Day Forecast</h2>';
            const today = new Date();
            data.list.forEach((item, index) => {
                if (index % 8 === 0) { // Show forecast every 24 hours
                    const weatherIcon = getWeatherIcon(item.weather[0].description);
                    let dayLabel = '';
                    if (index === 0) {
                        dayLabel = 'Today';
                    } else if (index === 8) {
                        dayLabel = 'Tomorrow';
                    } else {
                        const forecastDate = new Date(today);
                        forecastDate.setDate(today.getDate() + index / 8);
                        dayLabel = forecastDate.toLocaleDateString();
                    }
                    forecastHtml += `
                        <div class="forecast-item">
                            <span class="weather-icon">${weatherIcon}</span>
                            <div>
                                <h3>${dayLabel}</h3>
                                <p>${item.weather[0].description}</p>
                                <p>Temperature: ${item.main.temp} °C</p>
                                <p>Humidity: ${item.main.humidity}%</p>
                                <p>Wind Speed: ${item.wind.speed} m/s</p>
                            </div>
                        </div>
                    `;
                }
            });
            document.getElementById('forecast-info').innerHTML = forecastHtml;
        } else {
            document.getElementById('forecast-info').innerHTML = `<p>City not found</p>`;
        }
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        document.getElementById('forecast-info').innerHTML = `<p>Error fetching forecast data</p>`;
    }
}
