/**
 * Weather Display Module
 * Handles fetching and displaying weather information using Open-Meteo API
 */

let weatherDisplay
let forecastDisplay

/**
 * Set up the weather display functionality
 */
export function setupWeatherDisplay() {
  weatherDisplay = document.getElementById("weather-display")
  forecastDisplay = document.getElementById("forecast-display")

  if (!weatherDisplay) {
    console.error("Weather display element not found")
    return
  }

  // Fetch weather data
  fetchWeatherData()

  // Update weather data every 30 minutes
  setInterval(fetchWeatherData, 30 * 60 * 1000)
}

/**
 * Fetch weather data based on location
 */
async function fetchWeatherData() {
  try {
    // First get location from IP
    const locationResponse = await fetch("https://ipinfo.io/json")

    if (!locationResponse.ok) {
      throw new Error("Failed to fetch location data")
    }

    const locationData = await locationResponse.json()

    // Extract coordinates
    if (!locationData.loc) {
      throw new Error("Location coordinates not available")
    }

    const [latitude, longitude] = locationData.loc.split(",")

    // Fetch weather data using Open-Meteo API
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`,
    )

    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch weather data")
    }

    const weatherData = await weatherResponse.json()
    displayWeatherData(weatherData, locationData.city)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    weatherDisplay.textContent = "Weather data unavailable"
  }
}

/**
 * Display weather data
 * @param {Object} data - Weather data object
 * @param {string} cityName - City name
 */
function displayWeatherData(data, cityName) {
  if (!data || !data.current) {
    weatherDisplay.textContent = "Weather data unavailable"
    return
  }

  // Extract current weather information
  const temperature = Math.round(data.current.temperature_2m)
  const feelsLike = Math.round(data.current.apparent_temperature)
  const humidity = Math.round(data.current.relative_humidity_2m)
  const precipitation = data.current.precipitation
  const windSpeed = data.current.wind_speed_10m
  const weatherCode = data.current.weather_code

  // Get weather description from code
  const weatherDescription = getWeatherDescription(weatherCode)

  // Format weather string
  const weatherString = `${temperature}°${data.current_units.temperature_2m} (feels like ${feelsLike}°${data.current_units.apparent_temperature}), ${weatherDescription} in ${cityName}`

  // Additional weather details
  const detailsString = `Humidity: ${humidity}%, Wind: ${windSpeed} ${data.current_units.wind_speed_10m}, Precipitation: ${precipitation} ${data.current_units.precipitation}`

  // Update weather display
  weatherDisplay.textContent = weatherString

  // Display forecast if available
  if (data.daily && forecastDisplay) {
    displayForecast(data.daily)
  }
}

/**
 * Display forecast data
 * @param {Object} dailyData - Daily forecast data
 */
function displayForecast(dailyData) {
  // Clear previous forecast
  forecastDisplay.innerHTML = ""

  // Only show next 3 days
  const daysToShow = Math.min(3, dailyData.time.length)

  for (let i = 0; i < daysToShow; i++) {
    const date = new Date(dailyData.time[i])
    const dayName = date.toLocaleDateString(undefined, { weekday: "short" })
    const maxTemp = Math.round(dailyData.temperature_2m_max[i])
    const minTemp = Math.round(dailyData.temperature_2m_min[i])
    const weatherCode = dailyData.weather_code[i]

    const forecastDay = document.createElement("div")
    forecastDay.className = "forecast-day"
    forecastDay.innerHTML = `
      <div>${dayName}</div>
      <div>${minTemp}° - ${maxTemp}°</div>
    `

    forecastDisplay.appendChild(forecastDay)
  }
}

/**
 * Get weather description from WMO weather code
 * @param {number} code - WMO weather code
 * @returns {string} - Weather description
 */
function getWeatherDescription(code) {
  // WMO Weather interpretation codes (WW)
  const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  }

  return weatherCodes[code] || "Unknown"
}

