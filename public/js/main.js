// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UNAUTHORIZED_MESSAGE = 'Ehhez a művelethez bejelentkezés szükséges'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FORBIDDEN_MESSAGE = 'Ehhez a művelethez admin jogosultság szükséges'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function displayMessage(message, type = 'danger') {
  const errorEl = document.createElement('article')
  if (type === 'danger') {
    errorEl.classList.add('p-6', 'text-gray-900', 'bg-red-100', 'border-l-4', 'border-red-500')
  } else if (type === 'success') {
    errorEl.classList.add('p-6', 'text-green-600', 'bg-green-100', 'border-l-4', 'border-green-500')
  } else {
    errorEl.classList.add('p-6', 'text-yellow-500', 'bg-yellow-100', 'border-l-4', 'border-yellow-500')
  }

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
