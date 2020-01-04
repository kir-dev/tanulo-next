document.addEventListener('DOMContentLoaded', () => {
  const calendarEl = document.getElementById('calendar')

  const roomNumber = window.location.pathname.split('/').pop()

  fetch(`/rooms/${roomNumber}/events`)
    .then(response => response.json())
    .then(data => {
      const calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['interaction', 'timeGrid', 'dayGrid'],
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridOneDay,timeGridWeek,dayGridMonth'
        },
        defaultView: 'timeGridWeek',
        views: {
          timeGridOneDay: {
            type: 'timeGrid',
            duration: { days: 1 },
            buttonText: 'nap'
          }
        },
        locale: 'hu',
        selectable: true,
        events: data,
        select: info => {
          location.href = `/groups/new?start=${info.startStr}&end=${info.endStr}&roomId=${roomNumber}`
        },
        eventClick: calEvent => {
          location.href = `/groups/${calEvent.event.groupId}`
        }
      })

      calendar.render()
    })
})
