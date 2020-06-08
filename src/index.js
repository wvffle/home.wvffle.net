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
    for (const item of [...this.#items].sort((a, b) => b.date - a.date)) {
      this.root.appendChild(item.render())
    }
  }
}

/**
 * Class responsible for serialization/deserialization
 */
export class Serializable {
  /**
   * Method used to serialize instance into JSON compatible object
   * @abstract
   * @returns {Object|String|Number}
   */
  serialize () {}

  /**
   * Method used to deserialize serialized data into a new instance
   * @abstract
   * @returns {Serializable}
   */
  static deserialize () {}
}

export class Value extends Serializable {
  constructor (value) {
    super()
    this.value = value
  }

  /**
   * @inheritdoc
   * @override
   */
  serialize () {
    return { value: this.value }
  }

  /**
   * @inheritdoc
   * @override
   */
  static deserialize ({ value }) {
    return value
  }
}

/**
 * Enchanced JSON.parse/stringify
 */
export class Serializer {
  static cache = {
    Serializable,
    Value
  }

  static register (Class) {
    Serializer.cache[Class.name] = Class
  }

  static stringify (data) {
    if (Array.isArray(data)) {
      return `[${data.map(Serializer.stringify)}]`
    }

    if (data.constructor.name === 'Object') {
      const value = Object.entries(data).map(([key, value]) => {
        return `"${key}":${Serializer.stringify(value)}`
      }).join(',')

      return `{${value}}`
    }

    if (data instanceof Serializable) {
      return `{"$type":"Serializable","$class":"${data.constructor.name}","$value":${Serializer.stringify(data.serialize())}}`
    }

    if (typeof data === 'number') {
      return data
    }

    if (typeof data === 'string') {
      return `"${data.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`
    }

    return `{"$type":"${data.constructor.name}","$value":"${data}"}`
  }

  static parse (data) {
    const json = JSON.parse(data)

    const parse = (data) => {
      if (data === undefined) {
        return undefined
      }

      if (Array.isArray(data)) {
        return data.map(parse)
      }

      if (data.constructor.name === 'Object' && !('$type' in data)) {
        const res = {}

        for (const [key, value] of Object.entries(data)) {
          res[key] = parse(value)
        }

        return res
      }

      if (typeof data === 'string' || typeof data === 'number') {
        return data
      }

      if (data.$type === 'Serializable') {
        const value = parse(data.$value)
        return Serializer.cache[data.$class].deserialize(value)
      }

      const Class = window[data.$type]
      return 'parse' in Class
        ? Class.parse(data.$value)
        : Class(data.$value)
    }

    return parse(json)
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

        const value = target.cache[prop] || localStorage[prop]

        if (value) {
          return Serializer.parse(value)
        }

        return undefined
      },

      set (target, prop, value) {
        return target.cache[prop] = localStorage[prop] = Serializer.stringify(new Value(value))
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

  /**
   * @inheritdoc
   * @override
   */
  serialize () {
    const { data, meta } = this
    return { data, meta }
  }

  /**
   * @inheritdoc
   * @override
   */
  static deserialize ({ data, meta }) {
    return new RSSFeed(data, meta)
  }
}

Serializer.register(RSSFeed)

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
