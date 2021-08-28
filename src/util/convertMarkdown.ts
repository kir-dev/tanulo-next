import markdown from 'markdown-it'
import sanitizeHtml from 'sanitize-html'

export function formatMdToSafeHTML(mdBody: string): string {
  const dirtyHtml = new markdown({ html: false, breaks: true }).render(mdBody)
  const cleanHtml = sanitizeHtml(dirtyHtml, {
    transformTags: {
      'h1': 'h3',
      'h2': 'h4',
      'h3': 'h5',
      'h4': 'h5'
    }
  })
  return cleanHtml
}
