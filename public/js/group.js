// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteGroup = id => {
  if (confirm('Biztosan törlöd?')) {
    fetch(`/groups/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.status === 204) {
          location.href = '/groups'
        }
      })
      .catch(err => console.error(err))
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function submitExportForm() {
  document.getElementById('export-form').submit()
}

const dropdown = document.querySelector('.dropdown')
if (dropdown) {
  dropdown.addEventListener('click', event => {
    event.stopPropagation()
    dropdown.classList.toggle('is-active')
  })
  document.addEventListener('click', () => {
    dropdown.classList.remove('is-active')
  })
}

const validateGroup = (data) => {
  const errors = []
  const room = parseInt(data.get('room'))
  const name = data.get('name')

  if (!name) {
    errors.push('A név kitöltése kötelező')
  }

  if (typeof room !== 'number' || room < 3 || room > 18) {
    errors.push('A szint csak 3 és 18 közötti szám lehet')
  }
  return errors
}

const handleResponse = async (res) => {
  switch (res.status) {
  case 201:
    location.href = '/groups'
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
}

const addGroup = (event) => {
  event.preventDefault()
  const formData = new FormData(event.target)
  const errors = validateGroup(formData)

  if (errors.length) {
    clearMessages()
    errors.forEach((err) => displayMessage('danger', err))
  } else {
    fetch('/groups', { method: 'POST', body: formData })
      .then(async (res) => await handleResponse(res))
      .catch((err) => displayMessage('danger', err))
  }
}

const formEl = document.getElementById('group-form')
if (formEl) {
  formEl.addEventListener('submit', addGroup)
}
