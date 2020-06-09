import { Store } from '/index.js'

/**
 * Just a regular Store with localStorage support removed
 * to avoid collisions with normal app
 */
export class MemoryStore extends Store {
  _get (target, prop) {
    if (prop[0] === '$') {
      return target[prop]
    }

    if (prop in this.$cache) {
      return this.$cache[prop]
    }

    return undefined
  }

  _set (target, prop, value) {
    return this.$cache[prop] = value
  }
}

