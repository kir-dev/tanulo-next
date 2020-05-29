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

const dropdown = document.querySelector('.dropdown')
dropdown.addEventListener('click', event => {
  event.stopPropagation()
  dropdown.classList.toggle('is-active')
})
document.addEventListener('click', () => {
  dropdown.classList.remove('is-active')
})
