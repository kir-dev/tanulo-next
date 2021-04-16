const commonCalendarOptions = {
  views: {
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
    week: 'hét',
  },
  nowIndicator: true,
  firstDay: 1,
  locale: 'hu',
  selectable: true,
  eventClick: (calEvent) =>
    (location.href = `/groups/${calEvent.event.groupId}`)
}

function generateWebCalendar(data, calendarEl, room) {
  const calendar = new FullCalendar.Calendar(calendarEl, {
    ...commonCalendarOptions,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridOneDay,timeGridWeek,dayGridMonth',
    },
    initialView: 'timeGridWeek',
    events: data,
    select: (info) => {
      if (info.view.type === 'dayGridMonth') {
        calendar.gotoDate(info.start)
        calendar.changeView('timeGridOneDay')
      } else {
        location.href = `/groups/new?start=${info.startStr}&end=${info.endStr}&roomId=${room}`
      }
    }
  })
  return calendar
}

function generateMobileCalendar(data, calendarEl, room) {
  const calendar = new FullCalendar.Calendar(calendarEl, {
    ...commonCalendarOptions,
    headerToolbar: {
      left: 'title',
      center: '',
      right: 'timeGridOneDay,dayGridMonth'
    },
    initialView: 'timeGridOneDay',
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
    select: (info) => {
      if (info.view.type === 'dayGridMonth') {
        calendar.gotoDate(info.start)
        calendar.changeView('timeGridOneDay')
      }
      else {
        location.href = `/groups/new?start=${info.startStr}&end=${info.endStr}&roomId=${room}`
      }
    }
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
