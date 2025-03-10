/**
 * Calendar Display Module
 * Handles displaying calendar information
 */

let dayOfYearElement
let weekOfYearElement

/**
 * Set up the calendar display functionality
 */
export function setupCalendarDisplay() {
  dayOfYearElement = document.getElementById("day-of-year")
  weekOfYearElement = document.getElementById("week-of-year")

  if (!dayOfYearElement || !weekOfYearElement) {
    console.error("Calendar display elements not found")
    return
  }

  // Update calendar info
  updateCalendarInfo()

  // Update calendar info at midnight
  scheduleNextDayUpdate()
}

/**
 * Update calendar information
 */
function updateCalendarInfo() {
  const now = new Date()

  // Calculate day of year
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now - start
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)

  // Calculate week of year
  const weekOfYear = getWeekNumber(now)

  // Calculate days left in year
  const daysInYear = isLeapYear(now.getFullYear()) ? 366 : 365
  const daysLeft = daysInYear - dayOfYear

  // Update display
  dayOfYearElement.textContent = `Day ${dayOfYear} of ${daysInYear} (${daysLeft} days left in ${now.getFullYear()})`
  weekOfYearElement.textContent = `Week ${weekOfYear[1]} of ${getWeeksInYear(now.getFullYear())}`
}

/**
 * Schedule the next update at midnight
 */
function scheduleNextDayUpdate() {
  const now = new Date()
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  const timeUntilMidnight = tomorrow - now

  setTimeout(() => {
    updateCalendarInfo()
    scheduleNextDayUpdate()
  }, timeUntilMidnight)
}

/**
 * Get the week number for a date
 * @param {Date} date - Date to get week number for
 * @returns {Array} - [year, week number]
 */
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return [d.getUTCFullYear(), Math.ceil(((d - yearStart) / 86400000 + 1) / 7)]
}

/**
 * Check if a year is a leap year
 * @param {number} year - Year to check
 * @returns {boolean} - True if leap year
 */
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * Get the number of weeks in a year
 * @param {number} year - Year to check
 * @returns {number} - Number of weeks
 */
function getWeeksInYear(year) {
  const d = new Date(year, 11, 31)
  const week = getWeekNumber(d)[1]
  return week === 1 ? getWeekNumber(new Date(year, 11, 24))[1] : week
}

