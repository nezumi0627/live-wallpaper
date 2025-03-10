/**
 * Location Display Module
 * Handles fetching and displaying location based on IP
 */

let locationDisplay

/**
 * Set up the location display functionality
 */
export function setupLocationDisplay() {
  locationDisplay = document.getElementById("location-display")

  if (!locationDisplay) {
    console.error("Location display element not found")
    return
  }

  // Fetch location data
  fetchLocationData()
}

/**
 * Fetch location data based on IP
 */
async function fetchLocationData() {
  try {
    // Using ipinfo.io to get location data (free tier)
    const response = await fetch("https://ipinfo.io/json")

    if (!response.ok) {
      throw new Error("Failed to fetch location data")
    }

    const data = await response.json()
    displayLocationData(data)
  } catch (error) {
    console.error("Error fetching location data:", error)
    locationDisplay.textContent = "Location unavailable"
  }
}

/**
 * Display location data
 * @param {Object} data - Location data object
 */
function displayLocationData(data) {
  if (!data) {
    locationDisplay.textContent = "Location unavailable"
    return
  }

  // Extract country and region
  const country = data.country || ""
  const region = data.region || ""
  const city = data.city || ""

  // Format location string to avoid repetition (e.g., "Fukuoka, Fukuoka")
  let locationString = ""

  if (city && region && country) {
    // Check if city and region are the same
    if (city === region) {
      locationString = `${city}, ${country}`
    } else {
      locationString = `${city}, ${region}, ${country}`
    }
  } else if (region && country) {
    locationString = `${region}, ${country}`
  } else if (country) {
    locationString = country
  } else {
    locationString = "Location unavailable"
  }

  // Update location display
  locationDisplay.textContent = locationString
}

