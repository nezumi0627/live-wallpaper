/**
 * Playback Status Module
 * Handles displaying playback status (paused/playing)
 */

let playbackStatusElement
let isPaused = true

/**
 * Set up the playback status functionality
 */
export function setupPlaybackStatus() {
  playbackStatusElement = document.getElementById("playback-status")

  if (!playbackStatusElement) {
    console.error("Playback status element not found")
    return
  }

  // Set initial state
  updatePlaybackStatus(isPaused)

  // Expose the playback change handler to the global scope
  window.handlePlaybackChange = handlePlaybackChange
}

/**
 * Handle playback state change
 * @param {string} data - JSON formatted playback data
 */
function handlePlaybackChange(data) {
  try {
    const playbackData = JSON.parse(data)

    if (playbackData && typeof playbackData.IsPaused !== "undefined") {
      updatePlaybackStatus(playbackData.IsPaused)
    }
  } catch (error) {
    console.error("Error processing playback data:", error)
  }
}

/**
 * Update playback status display
 * @param {boolean} paused - Whether playback is paused
 */
function updatePlaybackStatus(paused) {
  isPaused = paused

  // We're not showing the status visually anymore, but still tracking it
  console.log(`Playback status: ${isPaused ? "Paused" : "Playing"}`)
}

