const submitBtn = document.getElementById('submitBtn')
const textArea = document.getElementById('desc')
const charLimit = 500

function listenLength(el, characterCount) {  
  if (characterCount > charLimit) {
    el.innerHTML = 'Túl hosszú!'
    el.setAttribute('style', 'color:red;')
    submitBtn.disabled = true
  }
  else {
    el.innerHTML = characterCount + ' / ' + charLimit
    el.setAttribute('style', 'color:grey;')
    submitBtn.disabled = false
  }
}

const easyMDE = new EasyMDE({
  element: textArea,
  toolbar: [
    'bold', 'italic', 'heading', '|', 'unordered-list', 'ordered-list',
    '|', 'undo', 'redo', '|', 'guide'
  ],
  forceSync: true,
  autoDownloadFontAwesome: false,
  spellChecker: false,
  placeholder: 'Kattints az utmutató gombjára a részletekért...',
  status: [{
    className: 'chars',
    defaultValue: (el) => {
      el.innerHTML = '0 / ' + charLimit
    },
    onUpdate: (el) => {
      characterCount = easyMDE.value().length
      listenLength(el, characterCount)
    }
  }]
})