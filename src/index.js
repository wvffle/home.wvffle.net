import set from 'lodash.set'
import PriorityQueue from 'fastpriorityqueue'
import sanitize from 'sanitize-html'

/**
 * @constant {Number} RSS Feed fetch interval in ms
 */
export const FETCH_INTERVAL = 5 * 60 * 1000

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


// NOTE: Overwriting parseURL method to automatically bypass CORS
RSSParser.prototype._parseURL = RSSParser.prototype.parseURL
RSSParser.prototype.parseURL = function (url) {
  return this._parseURL(`https://cors-anywhere.herokuapp.com/${url}`)
}

// RSS parser
export const parser = new RSSParser()

/**
 * Random utils
 */
export class Random {

  /**
   * Random id
   */
  static get Id () {
    return 'x' + (Math.random() * 1e4 ^ 0).toString(16)
  }
}


export class Renderer {
  #items = new PriorityQueue((a, b) => a.date > b.date)

  constructor (rootSelector = '#app') {
    this.root = q(rootSelector)
  }

  add (...items) {
    for (const item of items) {
      this.#items.add(item)
    }
  }

  render () {
    for (const el of this.root.children) {
      el.remove()
    }

    this.#items.forEach(item => {
      this.root.appendChild(item.render())
    })
  }
}

/**
 * Class responsible for serialization/deserialization
 */
export class Serializable {
  constructor (value) {
    this.value = value
  }

  /**
   * Method used to serialize instance into JSON compatible object
   * @returns {Object|String|Number}
   */
  serializer () {
    return this.value
  }
  
  /**
   * Method used to deserialize serialized data into a new instance
   * @returns {Serializable}
   */
  static deserializer (data) {
    return new Serializable(data)
  }

  /**
   * Serialize data
   * @returns String
   */
  serialize () { 
    const className = this.value instanceof Serializable
      ? this.value.constructor.name
      : undefined

    const value = className === undefined
      ? this.value
      : value.serializer()

    return JSON.stringify({ className, value }) 
  }

  /**
   * Deserialize data
   * @returns {Object|Serializable}
   */
  static deserialize (string) { 
    if (string === undefined) {
      return undefined
    }

    const data = JSON.parse(string) 

    if (data.className) { 
      return core[data.className].deserializer(data.value)
    }

    return data.value
  }
}

/**
 * Global store
 */
export class Store {
  constructor () {
    this.cache = {}

    // NOTE: Yeah, javascript pretty much allows to return from a constructor.
    //       I've done some crazy stuff with that in the past.
    return new Proxy(this, {
      get (target, prop) {
        if (prop[0] === '$') {
          return target[prop]
        }

        return target.cache[prop] || Serializable.deserialize(localStorage[prop])
      },

      set (target, prop, value) {
        return target.cache = localStorage[prop] = new Serializable(value).serialize()
      }
    })
  }

  /**
   * Method called when non-primitive values is updated
   */
  $update (key) {
    this[key] = this[key]
  }

  $set (key, index, value) {
    set(this[key], index, value)
    this.$update(key)
  }
}

export class RSSFeed extends Serializable {
  constructor (data, meta) {
    super()

    this.data = data
    this.meta = meta
    this.date = new Date(data.pubDate)
  }

  /**
   * Renders the feed
   * @returns {HTMLElement}
   */
  render () {
    const img = e('img.h-8.w-8.flex-shrink-0.mr-4')
    img.src = `https://besticon-demo.herokuapp.com/icon?size=32..48..80&url=${this.meta.link}`

    const a = e('a.flex.items-center',
      img,
      e('.truncate.w-full',
        e('h1.font-bold.font-lg.text-gray-800', this.data.title),
        e('.text-gray-700.text-xs.font-mono', this.date.toLocaleString())
      )
    )

    a.href = this.data.link

    return e(`#${Random.Id}.m-10.shadow-lg.rounded-lg.p-6.pt-4.bg-white`, 
      a,
      e('.content.text-gray-900.pt-4', this.data.content)
    )
  }

  serializer () {
    const { data, meta } = this
    return { data, meta }
  }

  static deserialize ({ data, meta }) {
    return new this.constructor(data, meta)
  }
}

export class RSSFetcher {
  constructor (store) {
    if (!store.feedTypes) {
      store.feedTypes = []
    }

    this.store = store
  }

  addFeed (regex, Feed) {
    this.store.$set('feedTypes', store.feedTypes.length, { 
      regex, Feed
    })
  }

  /**
   * Fetch rss feed
   */
  async fetch (url) {
    const data = await parser.parseURL(url)

    const meta = { ...data }
    delete meta.items
    
    let FeedClass = RSSFeed
    for (const { regex, Feed } of this.store.feedTypes) {
      if (regex.test(url)) {
        FeedClass = Feed
        break
      }
    }

    return data.items.map(item => new FeedClass(item, meta))
  }
}
