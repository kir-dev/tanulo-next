// eslint-disable-next-line @typescript-eslint/no-unused-vars
function deleteTicket(id, own) {
  const url = `/tickets/${own ? 'own/' : ''}${id}`

  fetch(url, { method: 'DELETE' })
    .then(async (res) => {
      switch (res.status) {
        case 204:
          const ticket = document.getElementById(`ticket-${id}`)
          const container = ticket.parentNode
          container.removeChild(ticket)
          displayMessage('Hibajegy sikeresen törölve', 'success')
          if (container.childElementCount == 0) {
            const text = document.createElement('p')
            text.classList.add('ml-6')
            text.innerHTML = own ? 'Nincsen hibajegyed' : 'Nincsenek hibajegyek'
            container.appendChild(text)
          }
          break
        case 401:
          displayMessage(UNAUTHORIZED_MESSAGE)
          break
        case 403:
          displayMessage(FORBIDDEN_MESSAGE)
          break
        case 404:
          data = await res.json()
          displayMessage(data.message)
          break
      }
    })
    .catch((err) => displayMessage(err))
}

function validateTicket(data) {
  const errors = []
  const room = parseInt(data.get('roomNumber'))
  const description = data.get('description')

  if (typeof room !== 'number' || room < 3 || room > 18) {
    errors.push('A szint csak 3 és 18 közötti szám lehet')
  }
  if (!description) {
    errors.push('A leírás nem lehet üres')
  }
  if (description.length > 500) {
    errors.push('A leírás max 500 karakter lehet')
  }
  return errors
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addTicket() {
  const formEl = document.getElementById('ticket-form')
  const formData = new FormData(formEl)
  const errors = validateTicket(formData)

  if (errors.length) {
    clearMessages()
    errors.forEach((err) => displayMessage(err))
  } else {
    fetch('/tickets', { method: 'POST', body: formData })
      .then(async (res) => {
        switch (res.status) {
          case 201:
            sendMessage('Hibajegy sikeresen létrehozva', 'success')
            location.href = '/tickets'
            break
          case 400:
            const data = await res.json()
            clearMessages()
            data.errors.forEach((err) => displayMessage(err.msg))
            break
          case 401:
            displayMessage(UNAUTHORIZED_MESSAGE)
            break
        }
      })
      .catch((err) => displayMessage(err))
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function moveTicket(id) {
  const formEl = document.getElementById(`ticket-form-${id}`)
  const formData = new FormData(formEl)
  fetch(`/tickets/${id}`, {
    method: 'PUT',
    body: formData,
  })
    .then(async (res) => {
      switch (res.status) {
        case 200:
          const status = await res.json()
          const labelEl = document.getElementById(`ticket-label-${id}`)
          labelEl.innerHTML = status
          displayMessage(
            'Hibajegy státusza sikeresen megváltoztatva!',
            'success'
          )
          break
        case 400:
          const data = await res.json()
          clearMessages()
          data.errors.forEach((err) => displayMessage(err.msg))
          break
        case 401:
          displayMessage(UNAUTHORIZED_MESSAGE)
          break
      }
    })
    .catch((err) => displayMessage(err))
}
