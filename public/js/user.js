// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateUser(id) {
  const floorEl = document.getElementById('floor-input')
  const floor = parseInt(floorEl.value)
  if (floorEl.value !== '' && (floor < 3 || floor > 18)) {
    displayMessage('A szint üres vagy 3 és 18 közötti szám lehet')
  } else {
    fetch(`/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ floor }),
    })
      .then(async res => {
        switch (res.status) {
        case 200:
          const user = await res.json()
          floorEl.value = user.floor
          displayMessage('Saját szint sikeresen frissítve!', 'success')
          break
        case 400:
          const data = await res.json()
          clearMessages()
          data.errors.forEach(err => displayMessage(err.msg))
          break
        case 401:
          displayMessage(UNAUTHORIZED_MESSAGE)
          break
        default:
          displayMessage('Nem várt hiba történt')
          break
        }
      })
      .catch((err) => console.error(err))
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateRole(id) {
  const roleEl = document.getElementById('role')
  const role = roleEl.value
  console.log(role)
  if (role == '' || !(role == 'ADMIN' || role == 'TICKET_ADMIN' || role == 'USER')) {
    displayMessage('A felhasználói jogkör nem megfelelő.')
  } else {
    fetch(`/users/${id}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role }),
    })
      .then(async res => {
        switch (res.status) {
        case 201:
          sendMessage('Felhasználó rangja sikeresen frissítve', 'success')
          location.href = `/users/${id}`
          break
        case 400:
          const data = await res.json()
          clearMessages()
          data.errors.forEach((err) => displayMessage(err.msg))
          break
        case 403:
          displayMessage(UNAUTHORIZED_MESSAGE)
          break
        }
      })
      .catch((err) => displayMessage(err))
  }
}
