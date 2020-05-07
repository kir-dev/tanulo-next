new BulmaTagsInput('#tags')

// Getting rid of the blank tags-input
const myForm = document.getElementById('group-form')
myForm.addEventListener('submit', function () {
  const allInputs = myForm.getElementsByTagName('input')
  for (let i = 0; i < allInputs.length; i++) {
    const input = allInputs[i]
    if (input.name == 'subject' && (input.value == '')) {
      input.name = ''
    }
  }
})