// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteGroup = (id) => {
  fetch(`/groups/${id}`, { method: 'DELETE' })
    .then((res) => {
      if (res.status === 204) {
        location.href = '/groups'
      }
    })
    .catch((err) => console.error(err))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function submitExportForm() {
  document.getElementById('export-form').submit()
}
