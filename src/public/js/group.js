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
