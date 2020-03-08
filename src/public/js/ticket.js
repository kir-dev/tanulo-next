const deleteTicket = id => {
  if (confirm('Biztosan törlöd?')) {
    fetch(`/tickets/${id}`, { method: 'DELETE' })
    .then(res => {
      if (res.status === 204) {
        const ticket = document.getElementById(`ticket-${id}`)
        ticket.parentNode.removeChild(ticket)
      }
    })
    .catch(err => console.error(err))
  }
}
