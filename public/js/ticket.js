// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteTicket = id => {
  if (confirm('Biztosan törlöd?')) {
    fetch(`/tickets/${id}`, { method: 'DELETE' })
      .then(async (res) => {
        if (res.status === 204) {
          const ticket = document.getElementById(`ticket-${id}`)
          ticket.parentNode.removeChild(ticket)
        } else if (res.status === 404) {
          data = await res.json()
          displayMessage('danger', data.message)
        }
      })
      .catch(err => displayMessage('danger', err))
  }
}
