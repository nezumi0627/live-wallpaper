/**
 * System Monitor Module
 * Handles displaying and updating system information
 */

// DOM elements cache
let elements = {}

/**
 * Set up the system monitor functionality
 */
export function setupSystemMonitor() {
  // Cache DOM elements
  elements = {
    systemInfo: document.getElementById("system-info"),
    cpuText: document.getElementById("cpu-text"),
    cpuBar: document.getElementById("cpu-bar"),
    gpuText: document.getElementById("gpu-text"),
    gpuBar: document.getElementById("gpu-bar"),
    netText: document.getElementById("net-text"),
    netBar: document.getElementById("net-bar"),
    ramText: document.getElementById("ram-text"),
    ramBar: document.getElementById("ram-bar"),
  }

  // Expose the system data handler to the global scope
  window.handleSystemData = handleSystemData
}

/**
 * Handle incoming system data
 * @param {string} data - JSON formatted system data
 */
function handleSystemData(data) {
  try {
    const sysInfo = JSON.parse(data)
    updateSystemInfo(sysInfo)
  } catch (error) {
    console.error("Error processing system information:", error)
  }
}

/**
 * Update system information in the UI
 * @param {Object} sysInfo - System information object
 */
function updateSystemInfo(sysInfo) {
  // Update CPU information
  updateSystemElement(elements.cpuText, elements.cpuBar, sysInfo.CurrentCpu, sysInfo.NameCpu)

  // Update GPU information
  updateSystemElement(elements.gpuText, elements.gpuBar, sysInfo.CurrentGpu3D, sysInfo.NameGpu)

  // Update network information
  updateNetworkInfo(sysInfo)

  // Update memory information
  updateMemoryInfo(sysInfo)
}

/**
 * Update a system element (CPU, GPU)
 * @param {HTMLElement} textElement - Text element
 * @param {HTMLElement} barElement - Bar element
 * @param {number} usage - Usage percentage
 * @param {string} name - Device name
 */
function updateSystemElement(textElement, barElement, usage, name) {
  textElement.innerHTML = `<span class="system-value">${usage.toFixed(1)}%</span> ${name}`
  barElement.style.width = `${usage}%`
}

/**
 * Update network information
 * @param {Object} sysInfo - System information object
 */
function updateNetworkInfo(sysInfo) {
  // Convert bytes to Mbps (megabits per second)
  const downloadSpeed = ((sysInfo.CurrentNetDown * 8) / (1024 * 1024)).toFixed(2)
  const uploadSpeed = ((sysInfo.CurrentNetUp * 8) / (1024 * 1024)).toFixed(2)

  elements.netText.innerHTML = `
    <span class="system-value">${downloadSpeed} Mbps ↓</span>
    <span class="system-value">${uploadSpeed} Mbps ↑</span> ${sysInfo.NameNetCard}
  `

  // Set bar width based on download speed (capped at 100%)
  elements.netBar.style.width = `${Math.min(100, (downloadSpeed / 100) * 100)}%`
}

/**
 * Update memory information
 * @param {Object} sysInfo - System information object
 */
function updateMemoryInfo(sysInfo) {
  const totalRam = sysInfo.TotalRam
  const usedRam = totalRam - sysInfo.CurrentRamAvail
  const ramPercent = ((usedRam / totalRam) * 100).toFixed(1)

  elements.ramText.innerHTML = `
    <span class="system-value">${(usedRam / 1024).toFixed(1)} GB</span> / 
    ${(totalRam / 1024).toFixed(1)} GB (${ramPercent}%)
  `

  elements.ramBar.style.width = `${ramPercent}%`
}

