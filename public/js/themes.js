// Managing theme changes:
const darkId = 'dark-theme-css'
const lightId = 'light-theme-css'
const darkEl = document.querySelector(`link[id="${darkId}"]`)
const lightEl = document.querySelector(`link[id="${lightId}"]`)

function setCssDark() {
  darkEl.media = ''
  lightEl.media = 'none'
}

function setCssLight() {
  lightEl.media = ''
  darkEl.media = 'none'
}

// Sets up the needed css
// Will be calling the function once browser parsed the icon and link elements
function setCssBeforeLoading() {
  const styleSheet = localStorage.getItem('stylesheet-key')
  if ((typeof styleSheet == 'undefined') || (styleSheet == null)) {
    localStorage.setItem('stylesheet-key', lightId)
    setCssLight()
  }
  else if (styleSheet === lightId) {
    setCssLight()
  }
  else {
    setCssDark()
  }
}

// Calling the function before parsing ends and css is applied to avoid flickering
setCssBeforeLoading()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function changeTheme() {
  const styleSheet = localStorage.getItem('stylesheet-key')
  if ((typeof styleSheet == 'undefined')  || (styleSheet == null) || (styleSheet === lightId)) {
    localStorage.setItem('stylesheet-key', darkId)
    setCssDark()
  }
  else {
    localStorage.setItem('stylesheet-key', lightId)
    setCssLight()
  }
}
