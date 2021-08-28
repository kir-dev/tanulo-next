let meetingPlace = 'floor'
const MEETING_PLACES = ['floor', 'link', 'other']

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function selectMeetingPlace(kind) {
  meetingPlace = kind
  const selectedButton = document.getElementById(`${kind}Btn`)
  const selectedInputField = document.getElementById(`${kind}Input`)
  const selectedWrapper = document.getElementById(`${kind}Div`)
  selectedButton.classList.add('btn-meeting-selected')
  selectedInputField.required = true
  selectedWrapper.classList.remove('hidden')

  MEETING_PLACES.filter((it) => it !== kind).forEach((otherPlace) => {
    document
      .getElementById(`${otherPlace}Btn`)
      .classList.remove('btn-meeting-selected')
    document.getElementById(`${otherPlace}Input`).required = false
    document.getElementById(`${otherPlace}Div`).classList.add('hidden')
  })
}

function isValidHttpsUrl(str) {
  let url
  try {
    url = new URL(str)
  } catch (_) {
    return false
  } // not catching bad top lvl domain (1 character)

  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator
  // not allowing '(' and ')'
  // catching 1 character TLD

  return pattern.test(str) && url.protocol === 'https:'
}

const validateGroup = (data) => {
  const errors = []
  const room = parseInt(data.get('room'))
  const name = data.get('name')
  const place = data.get('place')
  const link = data.get('link')

  if (meetingPlace !== 'floor') {
    data.set('room', undefined)
  }

  if (meetingPlace !== 'link') {
    data.set('link', '')
  }

  if (meetingPlace !== 'other') {
    data.set('place', '')
  }

  if (!name) {
    errors.push('A név kitöltése kötelező')
  }

  if (
    meetingPlace === 'floor' &&
    (typeof room !== 'number' || room < 3 || room > 18)
  ) {
    errors.push('A szint csak 3 és 18 közötti szám lehet')
  }

  if (meetingPlace === 'link') {
    if (!link) {
      errors.push('A link megadása kötelező.')
    }
    if (!isValidHttpsUrl(link)) {
      errors.push('Hibás link')
      errors.push('A linknek így kell kinéznie: https://valami.valami)')
      errors.push('Pl: https://tanulo.sch.bme.hu')
    }
  }

  if (meetingPlace === 'other' && !place) {
    errors.push('A találkozási hely megadása kötelező.')
  }

  return errors
}

const handleResponse = async (res, edited) => {
  const data = await res.json()
  switch (res.status) {
    case 201:
      sendMessage(
        `Csoport sikeresen ${edited ? 'frissítve' : 'létrehozva'}`,
        'success'
      )
      location.href = `/groups/${data.id}`
      break
    case 400:
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
  formData.append('type', meetingPlace)
  if (meetingPlace !== 'floor') {
    formData.delete('room')
  }

  if (errors.length) {
    clearMessages()
    errors.forEach((err) => displayMessage(err))
  } else {
    fetch('/groups', { method: 'POST', body: formData })
      .then((res) => handleResponse(res, false))
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
  formData.append('type', meetingPlace)
  if (meetingPlace !== 'floor') {
    formData.delete('room')
  }

  if (errors.length) {
    clearMessages()
    errors.forEach((err) => displayMessage(err))
  } else {
    fetch(`/groups/${groupId}`, { method: 'PUT', body: formData })
      .then((res) => handleResponse(res, true))
      .catch((err) => displayMessage(err))
  }
}

const formEl = document.getElementById('group-form')
formEl.addEventListener('submit', (event) => {
  if (typeof isEditing !== 'undefined' && isEditing) editGroup(event)
  else addGroup(event)
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const calendarOptions = {
  // TODO: side-calendar, eslint-disable not needed
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
    center: 'prevWeek,prev,today,next,nextWeek',
  },
  titleFormat: {
    year: 'numeric',
    month: 'short',
    weekday: 'short',
    day: 'numeric',
  },
  aspectRatio: 0.7,
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
