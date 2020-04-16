document.addEventListener('DOMContentLoaded', () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.from(document.querySelectorAll('.navbar-burger')).slice()

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
      el.addEventListener('click', () => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target
        const $target = document.getElementById(target)

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active')
        $target.classList.toggle('is-active')
      })
    })
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function displayMessage(type, message) {
  const errorEl = document.createElement('article')
  errorEl.classList.add('message', 'alert-detail', `is-${type}`)

  const errorMessageEl = document.createElement('div')
  errorMessageEl.classList.add('message-body')
  errorMessageEl.textContent = message

  errorEl.appendChild(errorMessageEl)

  const alertEl = document.getElementById('alert')
  alertEl.append(errorEl)

  errorEl.addEventListener('click', () => errorEl.remove(), { once: true })
  setTimeout(() => errorEl.remove(), 4000)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function clearMessages() {
  const alertEl = document.getElementById('alert')
  alertEl.childNodes.forEach(el => el.remove())
}
