/**
 * Battery Display Module
 * Handles displaying battery status if available
 */

let batteryDisplay

/**
 * Set up the battery display functionality
 */
export function setupBatteryDisplay() {
  batteryDisplay = document.getElementById("battery-display")

  if (!batteryDisplay) {
    console.error("Battery display element not found")
    return
  }

  // Check if Battery API is supported
  if ("getBattery" in navigator) {
    updateBatteryInfo()
  } else {
    batteryDisplay.textContent = "Battery information not available"
  }
}

/**
 * Update battery information
 */
async function updateBatteryInfo() {
  try {
    const battery = await navigator.getBattery()

    // Update battery status
    updateBatteryStatus(battery)

    // Add event listeners for battery changes
    battery.addEventListener("chargingchange", () => updateBatteryStatus(battery))
    battery.addEventListener("levelchange", () => updateBatteryStatus(battery))
    battery.addEventListener("chargingtimechange", () => updateBatteryStatus(battery))
    battery.addEventListener("dischargingtimechange", () => updateBatteryStatus(battery))
  } catch (error) {
    console.error("Error getting battery info:", error)
    batteryDisplay.textContent = "Battery information not available"
  }
}

/**
 * Update battery status display
 * @param {BatteryManager} battery - Battery manager object
 */
function updateBatteryStatus(battery) {
  if (!battery) return

  const level = Math.round(battery.level * 100)
  const charging = battery.charging

  let statusText = `${level}%`

  if (charging) {
    statusText += " (Charging)"

    if (battery.chargingTime !== Number.POSITIVE_INFINITY) {
      const chargingHours = Math.floor(battery.chargingTime / 3600)
      const chargingMinutes = Math.floor((battery.chargingTime % 3600) / 60)
      statusText += ` - Full in ${chargingHours}h ${chargingMinutes}m`
    }
  } else if (battery.dischargingTime !== Number.POSITIVE_INFINITY) {
    const dischargingHours = Math.floor(battery.dischargingTime / 3600)
    const dischargingMinutes = Math.floor((battery.dischargingTime % 3600) / 60)
    statusText += ` - ${dischargingHours}h ${dischargingMinutes}m remaining`
  }

  batteryDisplay.textContent = statusText
}

