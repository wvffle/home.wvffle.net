import { Serializable, Serializer } from './serializer'
import set from 'lodash.set'

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

Serializer.register(Value)

/**
 * Global store
 */
export class Store {
  constructor () {
    const $cache = {}

    // NOTE: Yeah, javascript pretty much allows to return from a constructor.
    //       I've done some crazy stuff with that in the past.
    return new Proxy(this, {
      get (target, prop) {
        if (prop[0] === '$') {
          return target[prop]
        }

        if (prop in $cache) {
          return $cache[prop]
        }

        const stored = localStorage[prop]
        if (stored) {
          return Serializer.parse(stored)
        }

        return undefined
      },

      set (target, prop, value) {
        return localStorage[prop] = Serializer.stringify(new Value($cache[prop] = value))
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
