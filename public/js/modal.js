// omitted parameters won't be changed
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function toggleModal(
  newAction,
  newTitle,
  newDesc,
  newButtonText,
  newIsActionFunction = undefined
) {
  const title = document.getElementById('modal-title')
  const description = document.getElementById('modal-desc')
  const submitButton = document.getElementById('submit-button')
  const funcButton = document.getElementById('func-button')
  const form = document.getElementById('modal-form')

  if (newTitle) {
    title.innerHTML = newTitle
  }
  if (newDesc) {
    description.innerHTML = newDesc
  }
  if (newButtonText) {
    submitButton.innerHTML = newButtonText
    funcButton.innerHTML = newButtonText
  }
  if (newAction) {
    form.action = newAction
    funcButton.setAttribute(
      'onClick',
      `javascript: toggleModal(); ${newAction};`
    )
  }

  if (typeof newIsActionFunction !== 'undefined') {
    if (newIsActionFunction) {
      form.classList.add('hidden')
      funcButton.classList.remove('hidden')
    } else {
      funcButton.classList.add('hidden')
      form.classList.remove('hidden')
    }
  }

  document.querySelector('.modal').classList.toggle('hidden')
}
