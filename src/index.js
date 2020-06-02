import set from 'lodash.set'

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
  ] = s.match(/^([a-z-]+)?(?:#([a-z][a-z-0-9]+))?(?:\.([a-z][a-z-0-9\.]+))?$/)

  return { tag, id, className: classes.replace(/\./g, '') }
}

export const e = (s, ...c) => {
  const { tag, id, className } = ps(s)

  const el = document.createElement(tag)
  el.id = id
  el.className = className

  for (const child of c) {
    if (c instanceof HTMLElement) {
      el.appendChild(c)
      continue
    }

    el.appendChild(document.createTextNode(c))
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
  constructor (rootSelector = '#app') {
    this.root = q(rootSelector)
  }

  add (el) {
    this.root.appendChild(el)
    this.render()
  }

  render () {
    
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
  constructor () {
    super()

    this.el = e(`#${Random.Id}.feed`)
  }

  render (data) {
    return this.el
  }

  serializer () {
    return {}
  }

  static deserialize () {
    return new this.constructor()
  }
}

export class RSSFetcher {
  constructor (store) {
    if (!store.feedTypes) {
      store.feedTypes = []
    }

    this.store = store
  }

  addFeed (regex, feed) {
    this.store.$set('feedTypes', store.feedTypes.length, { 
      regex, feed 
    })
  }

  /**
   * Fetch rss feed
   */
  async fetch (url) {
    const data = await parser.parseURL(url)
    
    let feedInstance
    for (const { regex, feed } of this.store.feedTypes) {
      if (regex.test(url)) {
        feedInstance = feed
      }
    }

    if (feedInstance === undefined) {
      feedInstance = new RSSFeed()
    }

    return feedInstance.render(data)
  }
}
