import { q } from './waff-query'


export class Renderer {
  #items = []

  constructor (rootSelector = '#app') {
    this.root = q(rootSelector)
  }

  clear () {
    this.#items.length = 0
  }

  add (...items) {
    for (const item of items) {
      this.#items.push(item)
    }
  }

  render () {
    this.root.innerHTML = ''
    for (const feed of [...this.#items].sort((a, b) => b.date - a.date)) {
      if (feed.visible) {
        this.root.appendChild(feed.render())
      }
    }
  }
}

// NOTE: Export everything to allow testing
export * from './store'
export * from './rss/fetcher'
export * from './rss/feed'
export * from './rss/parser'
export * from './waff-query'
export * from './serializer'
