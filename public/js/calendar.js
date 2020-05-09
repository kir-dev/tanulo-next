const options = {
  plugins: ['interaction', 'timeGrid', 'dayGrid'],
  header: {
    left: 'prev,next today',
    center: 'title',
    right: 'timeGridOneDay,timeGridWeek,dayGridMonth'
  },
  defaultView: 'timeGridWeek',
  views: {
    dayGridMonth: {
      selectable: false
    },
    timeGridOneDay: {
      type: 'timeGrid',
      duration: { days: 1 },
      buttonText: 'nap',
      slotLabelFormat: { 
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: false
      },
      nowIndicator: true
    }
  },
  buttonText: {
    today: 'ma',
    month: 'hónap',
    week: 'hét'
  },
  locale: 'hu',
  selectable: true
}

function generateWebCalendar(data, calendarEl, room) {
  const calendar = new FullCalendar.Calendar(calendarEl, {
    ...options,
    events: data,
    select: info =>
      location.href = `/groups/new?start=${info.startStr}&end=${info.endStr}&roomId=${room}`,
    eventClick: calEvent =>
      location.href = `/groups/${calEvent.event.groupId}`,
  })
  return calendar
}

function generateMobileCalendar(data, calendarEl, room) {
  const calendar = new FullCalendar.Calendar(calendarEl, {
    ...options,
    header: {
      left: 'title',
      center: '',
      right: 'timeGridOneDay,dayGridMonth'
    },
    defaultView: 'timeGridOneDay',
    customButtons: {
      prevWeek: {
        text: '-7',
        click: () => {
          calendar.incrementDate({
            days: -7
          })
        }
      },
      nextWeek: {
        text: '+7',
        click: () => {
          calendar.incrementDate({
            days: 7
          })
        }
      }
    },
    footer: {
      center: 'prevWeek,prev,today,next,nextWeek'
    },
    titleFormat: {
      year: 'numeric',
      month: 'short',
      weekday: 'short',
      day: 'numeric'
    },
    aspectRatio: 0.75,
    events: data,
    select: info => {
      if (info.view.type === 'dayGridMonth') {
        calendar.gotoDate(info.start)
        calendar.changeView('timeGridOneDay')
      }
      else {
        location.href = `/groups/new?start=${info.startStr}&end=${info.endStr}&roomId=${room}`
      }
    },
    eventClick: calEvent =>
      location.href = `/groups/${calEvent.event.groupId}`
  })
  return calendar
}

document.addEventListener('DOMContentLoaded', () => {
  const calendarEl = document.getElementById('calendar')
  const room = window.location.pathname.split('/').pop()

  fetch(`/rooms/${room}/events`)
    .then(response => response.json())
    .then(data => {
      if (window.innerWidth < 768) {
        generateMobileCalendar(data, calendarEl, room).render()
      }
      else {
        generateWebCalendar(data, calendarEl, room).render()
      }
    })
})
