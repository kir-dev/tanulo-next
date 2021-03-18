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
    data.errors.forEach((err) => displayMessage(err.msg))
    break
  case 401:
    displayMessage(UNAUTHORIZED_MESSAGE)
    break
  }
}

const addGroup = (event) => {
  event.preventDefault()
  const formData = new FormData(event.target)
  const errors = validateGroup(formData)
  if (formData.get('tags')) {
    const tags = JSON.parse(formData.get('tags'))
    const parsedTags = tags.map((it) => it.value).join(',')
    formData.set('tags', parsedTags)
  }

  if (errors.length) {
    clearMessages()
    errors.forEach((err) => displayMessage(err))
  } else {
    fetch('/groups', { method: 'POST', body: formData })
      .then(handleResponse)
      .catch((err) => displayMessage(err))
  }
}

const editGroup = (event) => {
  event.preventDefault()
  const formData = new FormData(event.target)
  const errors = validateGroup(formData)
  if (formData.get('tags')) {
    const tags = JSON.parse(formData.get('tags'))
    const parsedTags = tags.map((it) => it.value).join(',')
    formData.set('tags', parsedTags)
  }

  if (errors.length) {
    clearMessages()
    errors.forEach((err) => displayMessage(err))
  } else {
    fetch(`/groups/${groupId}`, { method: 'PUT', body: formData })
      .then(handleResponse)
      .catch((err) => displayMessage(err))
  }
}

const formEl = document.getElementById('group-form')
formEl.addEventListener('submit', (event) => {
  if (typeof isEditing !== 'undefined' && isEditing)
    editGroup(event)
  else
    addGroup(event)
})

const calendarOptions = {
  plugins: ['timeGrid'],
  views: {
    timeGridOneDay: {
      type: 'timeGrid',
      duration: { days: 1 },
      slotLabelFormat: {
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: false,
      },
      nowIndicator: true,
    },
  },
  buttonText: { today: 'ma' },
  nowIndicator: true,
  locale: 'hu',
  selectable: false,
  header: {
    left: '',
    center: 'title',
    right: '',
  },
  defaultView: 'timeGridOneDay',
  footer: {
    center: 'prevWeek,prev,today,next,nextWeek'
  },
  titleFormat: {
    year: 'numeric',
    month: 'short',
    weekday: 'short',
    day: 'numeric'
  },
  aspectRatio: 0.7
}

// TODO: side-calendar
// const createCalendar = (room) => {
//   const calendarEl = document.getElementById('side-calendar')
//   while (calendarEl.firstChild) {
//     calendarEl.firstChild.remove()
//   }

//   fetch(`/rooms/${room}/events`)
//     .then((res) => res.json())
//     .then((data) => {
//       const calendar = new FullCalendar.Calendar(calendarEl, {
//         ...calendarOptions,
//         customButtons: {
//           prevWeek: {
//             text: '-7',
//             click: () => calendar.incrementDate({ days: -7 }),
//           },
//           nextWeek: {
//             text: '+7',
//             click: () => calendar.incrementDate({ days: 7 }),
//           },
//         },
//         events: data,
//       })
//       calendar.render()
//     })
// }

// const roomSelector = document.getElementById('room')
// createCalendar(roomSelector.value)
// roomSelector.addEventListener('change', (event) => {
//   createCalendar(event.target.value)
// })
