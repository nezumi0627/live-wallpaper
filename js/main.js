// Main entry point for the application
import { setupTrackDisplay } from "./trackDisplay.js"
import { setupSystemMonitor } from "./systemMonitor.js"
import { setupClock } from "./clock.js"
import { setupThemeToggle } from "./themeToggle.js"
import { setupLocationDisplay } from "./locationDisplay.js"
import { setupDisplayInfo } from "./displayInfo.js"
import { setupWeatherDisplay } from "./weatherDisplay.js"
import { setupAudioVisualizer } from "./audioVisualizer.js"
import { setupBatteryDisplay } from "./batteryDisplay.js"
import { setupCalendarDisplay } from "./calendarDisplay.js"

/**
 * Initialize the application
 */
function init() {
  // Set up the track display functionality
  setupTrackDisplay()

  // Set up the system monitor
  setupSystemMonitor()

  // Set up the clock
  setupClock()

  // Set up theme toggle
  setupThemeToggle()

  // Set up location display
  setupLocationDisplay()

  // Set up display info
  setupDisplayInfo()

  // Set up weather display
  setupWeatherDisplay()

  // Set up audio visualizer
  setupAudioVisualizer()

  // Set up battery display
  setupBatteryDisplay()

  // Set up calendar display
  setupCalendarDisplay()

  console.log("Music Display initialized")
}

// Initialize when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", init)

// Expose the functions that will be called by Lively Wallpaper
window.livelyCurrentTrack = (data) => {
  // Forward the track data to the track display module
  if (window.handleTrackData) {
    window.handleTrackData(data)
  }
}

window.livelySystemInformation = (data) => {
  // Forward the system data to the system monitor module
  if (window.handleSystemData) {
    window.handleSystemData(data)
  }
}

window.livelyWallpaperPlaybackChanged = (data) => {
  // Forward the playback state data to the playback status module
  if (window.handlePlaybackChange) {
    window.handlePlaybackChange(data)
  }
}

window.livelyAudioListener = (audioArray) => {
  // Forward the audio data to the audio visualizer module
  if (window.handleAudioData) {
    window.handleAudioData(audioArray)
  }
}

// Handle dark mode property change
window.livelyPropertyListener = (property, value) => {
  if (property === 'darkMode') {
    if (value) {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
  }
}
