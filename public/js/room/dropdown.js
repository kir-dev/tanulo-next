const dropdown = document.querySelector('#floorchange')
dropdown.addEventListener('click', (e) => {
  e.stopPropagation()
  dropdown.classList.toggle('is-active')
})

document.addEventListener('click', () => {
  dropdown.classList.remove('is-active')
})
