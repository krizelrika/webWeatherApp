// Static weather database
const weatherDatabase = {
    "London": {
        city: "London",
        country: "UK",
        temperatureC: 18,
        condition: "Cloudy",
        humidity: 72,
        wind: 12
    },
    "New York": {
        city: "New York",
        country: "USA",
        temperatureC: 22,
        condition: "Clear",
        humidity: 58,
        wind: 8
    },
    "Tokyo": {
        city: "Tokyo",
        country: "Japan",
        temperatureC: 25,
        condition: "Rainy",
        humidity: 85,
        wind: 15
    },
    "Paris": {
        city: "Paris",
        country: "France",
        temperatureC: 16,
        condition: "Cloudy",
        humidity: 68,
        wind: 10
    },
    "Sydney": {
        city: "Sydney",
        country: "Australia",
        temperatureC: 28,
        condition: "Clear",
        humidity: 45,
        wind: 18
    },
    "Moscow": {
        city: "Moscow",
        country: "Russia",
        temperatureC: -5,
        condition: "Snowy",
        humidity: 90,
        wind: 20
    },
    "Mumbai": {
        city: "Mumbai",
        country: "India",
        temperatureC: 32,
        condition: "Clear",
        humidity: 78,
        wind: 12
    }
};

// Weather icons mapping
const weatherIcons = {
    "Clear": "☀️",
    "Cloudy": "☁️",
    "Rainy": "🌧️",
    "Snowy": "❄️"
};

// Theme mapping
const weatherThemes = {
    "Clear": "theme-clear",
    "Cloudy": "theme-cloudy",
    "Rainy": "theme-rainy",
    "Snowy": "theme-snowy"
};

// Global state
let isFahrenheit = false;
let currentWeatherData = null;

// DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const tempToggle = document.getElementById('tempToggle');
const loading = document.getElementById('loading');
const weatherCard = document.getElementById('weatherCard');
const errorDiv = document.getElementById('error');
const presetBtns = document.querySelectorAll('.preset-btn');

// Weather display elements
const weatherIcon = document.getElementById('weatherIcon');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');

// Simulate API call with Promise
function getWeatherData(city) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = weatherDatabase[city];
            data ? resolve(data) : reject("City not found");
        }, 1000);
    });
}

// Temperature conversion functions
function celsiusToFahrenheit(celsius) {
    return Math.round((celsius * 9/5) + 32);
}

function fahrenheitToCelsius(fahrenheit) {
    return Math.round((fahrenheit - 32) * 5/9);
}

// Update temperature display
function updateTemperatureDisplay() {
    if (!currentWeatherData) return;
    
    const temp = isFahrenheit 
        ? celsiusToFahrenheit(currentWeatherData.temperatureC)
        : currentWeatherData.temperatureC;
    
    const unit = isFahrenheit ? '°F' : '°C';
    temperature.textContent = `${temp}${unit}`;
}

// Apply weather theme
function applyWeatherTheme(weatherCondition) {
    // Remove all theme classes
    document.body.classList.remove('theme-clear', 'theme-cloudy', 'theme-rainy', 'theme-snowy');
    
    // Add appropriate theme
    const themeClass = weatherThemes[weatherCondition] || 'theme-clear';
    document.body.classList.add(themeClass);
}

// Display weather data
function displayWeatherData(data) {
    currentWeatherData = data;
    
    // Update display elements
    weatherIcon.textContent = weatherIcons[data.condition] || '🌤️';
    cityName.textContent = `${data.city}, ${data.country}`;
    condition.textContent = data.condition;
    humidity.textContent = `${data.humidity}%`;
    windSpeed.textContent = `${data.wind} km/h`;
    
    // Update temperature with current unit
    updateTemperatureDisplay();
    
    // Apply theme
    applyWeatherTheme(data.condition);
    
    // Show weather card
    weatherCard.classList.add('show');
}

// Hide all displays
function hideDisplays() {
    weatherCard.classList.remove('show');
    errorDiv.classList.remove('show');
    loading.classList.remove('show');
}

// Show loading
function showLoading() {
    hideDisplays();
    loading.classList.add('show');
    searchBtn.disabled = true;
}

// Show error
function showError() {
    hideDisplays();
    errorDiv.classList.add('show');
    searchBtn.disabled = false;
}

// Search weather
async function searchWeather(city) {
    if (!city.trim()) return;
    
    showLoading();
    
    try {
        const data = await getWeatherData(city);
        displayWeatherData(data);
    } catch (error) {
        showError();
    } finally {
        searchBtn.disabled = false;
    }
}

// Event listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    searchWeather(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        searchWeather(city);
    }
});

tempToggle.addEventListener('click', () => {
    isFahrenheit = !isFahrenheit;
    tempToggle.classList.toggle('active');
    updateTemperatureDisplay();
});

// Preset city buttons
presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const city = btn.dataset.city;
        cityInput.value = city;
        searchWeather(city);
    });
});

// Initialize with London weather
window.addEventListener('load', () => {
    cityInput.value = 'London';
    searchWeather('London');
});