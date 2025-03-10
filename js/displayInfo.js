/**
 * Display Info Module
 * Handles displaying screen resolution and browser information
 */

let displayInfoElement

/**
 * Set up the display info functionality
 */
export function setupDisplayInfo() {
  displayInfoElement = document.getElementById("display-info")

  if (!displayInfoElement) {
    console.error("Display info element not found")
    return
  }

  // Update display info
  updateDisplayInfo()

  // Update on resize
  window.addEventListener("resize", updateDisplayInfo)
}

/**
 * Update display information
 */
function updateDisplayInfo() {
  // Get screen dimensions
  const screenWidth = window.screen.width
  const screenHeight = window.screen.height
  const screenRatio = (screenWidth / screenHeight).toFixed(2)

  // Get pixel ratio
  const pixelRatio = window.devicePixelRatio || 1

  // Get color depth
  const colorDepth = window.screen.colorDepth

  // Update display info
  displayInfoElement.textContent = `${screenWidth}×${screenHeight} (${screenRatio}:1) at ${pixelRatio}x DPI, ${colorDepth}-bit color`
}
