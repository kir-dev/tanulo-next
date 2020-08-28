// eslint-disable-next-line @typescript-eslint/no-unused-vars
function deleteTicket(id) {
  if (confirm('Biztosan törlöd?')) {
    fetch(`/tickets/${id}`, { method: 'DELETE' })
      .then(async res => {
        switch(res.status) {
        case 204:
          const ticket = document.getElementById(`ticket-${id}`)
          ticket.parentNode.removeChild(ticket)
          break
        case 401:
          displayMessage('danger', UNAUTHORIZED_MESSAGE)
          break
        case 403:
          displayMessage('danger', FORBIDDEN_MESSAGE)
          break
        case 404:
          data = await res.json()
          displayMessage('danger', data.message)
          break
        }
      })
      .catch(err => displayMessage('danger', err))
  }
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
    errors.forEach(err => displayMessage('danger', err))
  } else {
    fetch('/tickets', { method: 'POST', body: formData })
      .then(async (res) => {
        switch (res.status) {
        case 201:
          location.href = '/tickets'
          break
        case 400:
          const data = await res.json()
          clearMessages()
          data.errors.forEach((err) => displayMessage('danger', err.msg))
          break
        case 401:
          displayMessage('danger', UNAUTHORIZED_MESSAGE)
          break
        }
      })
      .catch((err) => displayMessage('danger', err))
  }
}

function moveTicket(id) {
  const formEl = document.getElementById(`ticket-form-${id}`)
  const formData = new FormData(formEl)
  fetch(`/tickets/${id}`, { 
    method: 'PUT', 
    body: formData
  })
    .then(async (res) => {
      switch (res.status) {
      case 201:
        location.href = '/tickets'
        break
      case 400:
        const data = await res.json()
        clearMessages()
        data.errors.forEach((err) => displayMessage('danger', err.msg))
        break
      case 401:
        displayMessage('danger', UNAUTHORIZED_MESSAGE)
        break
      }
    })
    .catch((err) => displayMessage('danger', err))
}
