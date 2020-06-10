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
    this.$cache = {}

    // NOTE: Yeah, javascript pretty much allows to return from a constructor.
    //       I've done some crazy stuff with that in the past.
    return new Proxy(this, {
      get (target, prop) {
        return target._get(target, prop)
      },

      set (target, prop, value) {
        return target._set(target, prop, value)
      }
    })
  }

  /**
   * Property getter
   */
  _get (target, prop) {
    if (prop[0] === '$') {
      return target[prop]
    }

    if (prop in this.$cache) {
      return this.$cache[prop]
    }

    const stored = localStorage[prop]
    if (stored) {
      return Serializer.parse(stored)
    }

    return undefined
  }

  /**
   * Property setter
   */
  _set (target, prop, value) {
    if (value === undefined) {
      delete localStorage[prop]
      delete this.$cache[prop]
      return true
    }

    localStorage[prop] = Serializer.stringify(new Value(this.$cache[prop] = value))
    return value || true
  }

  /**
   * Method called when non-primitive values is updated
   */
  $update (key) {
    this[key] = this[key]
  }

  /**
   * Method called to update Object data
   */
  $set (key, index, value) {
    set(this[key], index, value)
    this.$update(key)
  }
}
