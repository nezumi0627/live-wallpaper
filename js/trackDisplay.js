/**
 * Track Display Module
 * Handles displaying and updating music track information
 */

// DOM elements cache
let elements = {}

/**
 * Set up the track display functionality
 */
export function setupTrackDisplay() {
  // Cache DOM elements
  elements = {
    trackTitle: document.getElementById("track-title"),
    trackArtist: document.getElementById("track-artist"),
    albumInfo: document.getElementById("album-info"),
    additionalInfo: document.getElementById("additional-info"),
    artwork: document.getElementById("artwork"),
  }

  // Set initial state
  resetDisplay()

  // Expose the track data handler to the global scope
  window.handleTrackData = handleTrackData
}

/**
 * Handle incoming track data
 * @param {string} data - JSON formatted track data
 */
function handleTrackData(data) {
  try {
    const trackData = JSON.parse(data)
    trackData ? updateTrackInfo(trackData) : resetDisplay()
  } catch (error) {
    console.error("Error processing track data:", error)
    resetDisplay()
  }
}

/**
 * Update track information in the UI
 * @param {Object} track - Track information object
 */
function updateTrackInfo(track) {
  updateTextElement(elements.trackTitle, track.Title || "Unknown Title", "no-track", false)
  updateTextElement(elements.trackArtist, track.Artist || "Unknown Artist", "no-track", false)

  // Build and display album information
  const albumInfo = []
  if (track.AlbumTitle) albumInfo.push(track.AlbumTitle)
  if (track.AlbumArtist && track.AlbumArtist !== track.Artist) {
    albumInfo.push(`Album by ${track.AlbumArtist}`)
  }
  elements.albumInfo.textContent = albumInfo.join(" • ")

  // Build and display additional information
  elements.additionalInfo.textContent = buildAdditionalInfo(track).join(" • ")

  // Update album artwork
  updateAlbumArt(track.Thumbnail)

  console.log(`Now playing: ${track.Title} by ${track.Artist}`)
}

/**
 * Update a text element with optional class toggling
 * @param {HTMLElement} element - Element to update
 * @param {string} text - Text to display
 * @param {string} className - Class name to toggle
 * @param {boolean} addClass - Whether to add (true) or remove (false) the class
 */
function updateTextElement(element, text, className, addClass) {
  element.textContent = text
  element.classList.toggle(className, addClass)
}

/**
 * Build additional track information
 * @param {Object} track - Track information object
 * @returns {Array} - Formatted additional information
 */
function buildAdditionalInfo(track) {
  const info = []
  if (track.Genres?.length) info.push(`Genres: ${track.Genres.join(", ")}`)
  if (track.Subtitle) info.push(`Subtitle: ${track.Subtitle}`)
  if (track.TrackNumber) info.push(`Track Number: ${track.TrackNumber}`)
  return info
}

/**
 * Update album artwork
 * @param {string} thumbnailData - Thumbnail image data (Base64)
 */
function updateAlbumArt(thumbnailData) {
  if (!thumbnailData) {
    elements.artwork.src = ""
    return
  }

  elements.artwork.src = thumbnailData.startsWith("data:image/")
    ? thumbnailData
    : `data:image/png;base64,${thumbnailData}`
}

/**
 * Reset display to default state
 */
function resetDisplay() {
  updateTextElement(elements.trackTitle, "No Track Playing", "no-track", true)
  updateTextElement(elements.trackArtist, "Play a track to begin", "no-track", true)
  elements.albumInfo.textContent = ""
  elements.additionalInfo.textContent = ""
  elements.artwork.src = ""
  console.log("No track playing")
}

