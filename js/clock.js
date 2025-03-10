/**
 * Clock Module
 * Handles displaying and updating date and time with time-of-day icons
 */

let dateDisplay
let timeDisplay
let timeIcon
let updateAnimationTimeout
let previousMinute = -1

// Time periods definitions
const TIME_PERIODS = {
  MORNING: { name: "morning", start: 5, end: 10 },
  NOON: { name: "noon", start: 11, end: 14 },
  EVENING: { name: "evening", start: 15, end: 19 },
  NIGHT: { name: "night", start: 20, end: 4 },
}

/**
 * Set up the clock functionality
 */
export function setupClock() {
  dateDisplay = document.getElementById("date-display")
  timeDisplay = document.getElementById("time-display")
  timeIcon = document.getElementById("time-icon")

  if (!dateDisplay || !timeDisplay || !timeIcon) {
    console.error("Clock elements not found")
    return
  }

  // Update the clock immediately
  updateClock()

  // Update the clock every second
  setInterval(updateClock, 1000)
}

/**
 * Update the clock display
 */
function updateClock() {
  const now = new Date()
  const currentMinute = now.getMinutes()
  const currentHour = now.getHours()

  // Update date display
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  dateDisplay.textContent = now.toLocaleDateString(undefined, dateOptions)

  // Update time display with animation only when minute changes
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }

  // Only animate when minute changes
  if (currentMinute !== previousMinute) {
    // Add animation class
    timeDisplay.classList.add("update")

    // Clear any existing timeout
    if (updateAnimationTimeout) {
      clearTimeout(updateAnimationTimeout)
    }

    // Set timeout to remove animation class
    updateAnimationTimeout = setTimeout(() => {
      timeDisplay.classList.remove("update")
    }, 300)

    // Update previous minute
    previousMinute = currentMinute
  }

  timeDisplay.textContent = now.toLocaleTimeString(undefined, timeOptions)

  // Update time icon based on current hour
  updateTimeIcon(currentHour)
}

/**
 * Update the time icon based on the current hour
 * @param {number} hour - Current hour (0-23)
 */
function updateTimeIcon(hour) {
  // Remove all existing time period classes
  timeIcon.classList.remove("morning", "noon", "evening", "night")

  // Determine current time period
  let currentPeriod

  if (hour >= TIME_PERIODS.MORNING.start && hour <= TIME_PERIODS.MORNING.end) {
    currentPeriod = TIME_PERIODS.MORNING.name
  } else if (hour >= TIME_PERIODS.NOON.start && hour <= TIME_PERIODS.NOON.end) {
    currentPeriod = TIME_PERIODS.NOON.name
  } else if (hour >= TIME_PERIODS.EVENING.start && hour <= TIME_PERIODS.EVENING.end) {
    currentPeriod = TIME_PERIODS.EVENING.name
  } else {
    currentPeriod = TIME_PERIODS.NIGHT.name
  }

  // Add the appropriate class
  timeIcon.classList.add(currentPeriod)
}
