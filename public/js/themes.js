// Managing theme changes:
const darkId = 'dark-theme-css'
const lightId = 'light-theme-css'

function setDarkCss() {
  darkEl = document.querySelector(`link[id="${darkId}"]`)
  lightEl = document.querySelector(`link[id="${lightId}"]`)
  darkEl.media = ''
  lightEl.media = 'none'
}

function setLightCss() {
  darkEl = document.querySelector(`link[id="${darkId}"]`)
  lightEl = document.querySelector(`link[id="${lightId}"]`)
  lightEl.media = ''
  darkEl.media = 'none'
}

// Sets up the needed css
// Will be calling the function once browser parsed the icon and link elements
function setCssBeforeLoading() {
  const styleSheet = localStorage.getItem('stylesheet-key')
  if ((typeof styleSheet == 'undefined') || (styleSheet == null)) {
    localStorage.setItem('stylesheet-key', lightId)
    setLightCss()
  }
  else if (styleSheet === lightId) {
    setLightCss()
  }
  else {
    setDarkCss()
  }
}

// Calling the function before parsing ends and css is applied to avoid flickering
setCssBeforeLoading()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function changeTheme() {
  const styleSheet = localStorage.getItem('stylesheet-key')
  if ((typeof styleSheet == 'undefined')  || (styleSheet == null) || (styleSheet === lightId)) {
    localStorage.setItem('stylesheet-key', darkId)
    setDarkCss()
  }
  else {
    localStorage.setItem('stylesheet-key', lightId)
    setLightCss()
  }
}
