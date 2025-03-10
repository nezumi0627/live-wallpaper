/**
 * Theme Toggle Module
 * Handles toggling between light and dark themes
 */

let themeToggleBtn
let currentTheme = "light"

/**
 * Set up the theme toggle functionality
 */
export function setupThemeToggle() {
  themeToggleBtn = document.getElementById("theme-toggle")

  if (!themeToggleBtn) {
    console.error("Theme toggle button not found")
    return
  }

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    currentTheme = savedTheme
    applyTheme(currentTheme)
  }

  // Add event listener to toggle button
  themeToggleBtn.addEventListener("click", toggleTheme)
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light"

  // Save theme preference
  localStorage.setItem("theme", currentTheme)

  // Apply the theme
  applyTheme(currentTheme)
}

/**
 * Apply the specified theme
 * @param {string} theme - The theme to apply ('light' or 'dark')
 */
function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-theme")
    themeToggleBtn.textContent = "Light Mode"
  } else {
    document.body.classList.remove("dark-theme")
    themeToggleBtn.textContent = "Dark Mode"
  }
}

