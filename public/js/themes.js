function getCookie(cname) {
  const name = cname + '='
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function changeTheme() {
  const newTheme = getCookie('theme') === 'dark' ? 'light' : 'dark'
  if (newTheme === 'light') {
    document.querySelectorAll('.sunIcon').forEach((e) => e.classList.add('hidden'))
    document.querySelectorAll('.moonIcon').forEach((e) => e.classList.remove('hidden'))
  } else {
    document.querySelectorAll('.sunIcon').forEach((e) => e.classList.remove('hidden'))
    document.querySelectorAll('.moonIcon').forEach((e) => e.classList.add('hidden'))
  }
  document.cookie = `theme=${newTheme};path=/;SameSite=Lax`
  window.document.documentElement.className = newTheme
}
