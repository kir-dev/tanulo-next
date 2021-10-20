import Tagify from 'https://cdn.skypack.dev/@yaireo/tagify@3.22.0'

function transformTag(tagData) {
  tagData.style = 'line-height: normal;'
}

const tagsInput = document.querySelector('input[name=tags]')
const tagify = new Tagify(tagsInput, {
  editTags: false,
  transformTag: transformTag
})

if (typeof isEditing !== 'undefined' && isEditing && tags) {
  tagify.addTags(tags.split(','))
}
