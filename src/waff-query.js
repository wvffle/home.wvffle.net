import sanitize from 'sanitize-html'

// waff-query flavored utils
export const q = s => document.querySelector(s)
export const qq = s => [...document.querySelectorAll(s)]

// NOTE: See https://github.com/wvffle/waff-query/blob/master/lib/util/selector.js for fast selector parser
export const ps = (s = '') => {
  const [, 
    tag = 'div', 
    id, 
    classes = ''
  ] = s.match(/^([a-z][a-z-0-9]*)?(?:#([a-z][a-z-0-9]*))?(?:\.([a-z][a-z-0-9\.]*))?$/)

  return { tag, id, className: classes.replace(/\./g, ' ') }
}

export const e = (s, ...c) => {
  const { tag, id, className } = ps(s)
  const el = document.createElement(tag)

  if (id) {
    el.id = id
  }

  el.className = className

  for (const child of c) {
    if (child === undefined) {
      continue
    }

    if (child instanceof HTMLElement) {
      el.appendChild(child)
      continue
    }

    const html = sanitize(child.toString(), {
      allowedTags: ['a', 'img', 'pre', 'code', 'ul', 'ol', 'li', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'],
      allowedAttributes: { a: ['href'], img: ['src'], pre: ['rel'] }
    })

    const xml = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
    el.appendChild(xml.querySelector('body').children[0])
  }

  return el
}
