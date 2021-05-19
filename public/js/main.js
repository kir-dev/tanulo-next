// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UNAUTHORIZED_MESSAGE = 'Ehhez a művelethez bejelentkezés szükséges'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FORBIDDEN_MESSAGE = 'Ehhez a művelethez admin jogosultság szükséges'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function displayMessage(message, type = 'danger') {
  const messageEL = document.createElement('article')
  messageEL.classList.add('p-6', 'border-l-4', 'animate-fade-in-down')
  if (type === 'danger') {
    messageEL.classList.add('text-gray-900', 'bg-red-100', 'border-red-500')
  } else if (type === 'success') {
    messageEL.classList.add('text-green-900', 'bg-green-100', 'border-green-500')
  } else {
    messageEL.classList.add('text-yellow-900', 'bg-yellow-100', 'border-yellow-500')
  }

  const messageBodyEl = document.createElement('div')
  messageBodyEl.classList.add('message-body')
  messageBodyEl.textContent = message

  messageEL.appendChild(messageBodyEl)

  const alertEl = document.getElementById('alert')
  alertEl.append(messageEL)

  messageEL.addEventListener('click', () => messageEL.remove(), { once: true })
  setTimeout(() => messageEL.remove(), 4000)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function clearMessages() {
  const alertEl = document.getElementById('alert')
  alertEl.childNodes.forEach(el => el.remove())
}
