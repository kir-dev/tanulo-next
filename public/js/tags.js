function transformTag(tagData) {
  tagData.style = 'line-height: normal;'
}

const tagsInput = document.querySelector('input[name=tags]')
const tagify = new Tagify(tagsInput, {
  editTags: false,
  transformTag: transformTag
})

if (isEditing && tags) {
  tagify.addTags(tags.split(','))
}
