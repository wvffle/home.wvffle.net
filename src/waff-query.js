import sanitize from 'sanitize-html'

// waff-query flavored utils
export const q = s => document.querySelector(s)
export const qq = s => [...document.querySelectorAll(s)]

// NOTE: See https://github.com/wvffle/waff-query/blob/master/lib/util/selector.js for fast selector parser
export const ps = s => {
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
      allowedTags: ['a'],
      allowedAttributes: { a: ['href'] }
    })

    const xml = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/xml')
    el.appendChild(xml.children[0])
  }

  return el
}
