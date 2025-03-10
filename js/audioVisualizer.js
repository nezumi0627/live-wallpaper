/**
 * Audio Visualizer Module
 * Handles visualizing audio data from Lively Wallpaper
 */

let canvas
let ctx
let audioData = new Array(128).fill(0.2) // 0.2 is the initial value of audio data
let smoothedData = new Array(128).fill(0.2) // Smoothed audio data for smoother animation
let animationId

// Smoothing factor for audio data (higher is more smooth)
const smoothingFactor = 0.1
// Amplification factor for making the bars more visible (higher is more amplified)
const amplificationFactor = 2.0 // Amplify by 2 times for more visibility

/**
 * Set up the audio visualizer
 */
export function setupAudioVisualizer() {
  canvas = document.getElementById("audio-visualizer")

  if (!canvas) {
    console.error("Audio visualizer canvas not found")
    return
  }

  ctx = canvas.getContext("2d")

  // Set canvas dimensions to match container
  resizeCanvas()

  // Listen for window resize events
  window.addEventListener("resize", resizeCanvas)

  // Start animation loop
  startVisualization()

  // Expose the audio data handler to the global scope
  window.handleAudioData = handleAudioData
}

/**
 * Resize canvas to match container dimensions
 */
function resizeCanvas() {
  const container = canvas.parentElement
  canvas.width = container.clientWidth
  canvas.height = container.clientHeight
}

/**
 * Handle incoming audio data
 * @param {Array} data - Audio data array (128 values between 0-1)
 */
function handleAudioData(data) {
  if (!data || !Array.isArray(data) || data.length !== 128) {
    return
  }

  // Update audio data
  audioData = data
}

/**
 * Start the visualization animation loop
 */
function startVisualization() {
  // Cancel any existing animation
  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  // Animation function
  function animate() {
    // Smooth the audio data
    smoothAudioData()

    // Draw the visualization with smoothed data
    drawVisualization()
    
    // Request the next animation frame
    animationId = requestAnimationFrame(animate)
  }

  // Start animation
  animate()
}

/**
 * Smooth the audio data using linear interpolation
 */
function smoothAudioData() {
  for (let i = 0; i < audioData.length; i++) {
    smoothedData[i] = smoothedData[i] * (1 - smoothingFactor) + audioData[i] * smoothingFactor
  }
}

/**
 * Draw the audio visualization
 */
function drawVisualization() {
  if (!ctx || !canvas) return

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Set bar properties
  const barCount = smoothedData.length
  const barWidth = canvas.width / barCount
  const barSpacing = 1
  const barWidthWithSpacing = barWidth - barSpacing

  // Draw bars with smoothed data
  const isDarkTheme = document.body.classList.contains("dark-theme")
  ctx.fillStyle = isDarkTheme ? "#FFFFFF" : "#000000"; // ダークテーマ時は白、ライトテーマ時は黒
  for (let i = 0; i < barCount; i++) {
    const value = smoothedData[i] || 0

    // Amplify the bar height scaling for more visible movement
    const amplifiedValue = value * amplificationFactor  // Apply amplification factor
    const barHeight = Math.max(8, amplifiedValue * canvas.height * 3) // Increased height scaling factor

    const x = i * barWidth
    const y = canvas.height - barHeight

    ctx.fillRect(x, y, barWidthWithSpacing, barHeight)
  }
}
