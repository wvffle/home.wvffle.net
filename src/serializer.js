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

/**
 * Enchanced JSON.parse/stringify
 */
export class Serializer {
  static cache = {
    Serializable
  }

  /**
   * Registers new Serializable to the serializer
   * @param {Class} Class
   */
  static register (Class) {
    Serializer.cache[Class.name] = Class
  }

  /**
   * Stringify data
   * @param {Serializable|String|Number|Date|Object} data
   */
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
      if (data.constructor.name === 'Serializable') {
        return new Error('Cannot stringify plain Serializable. Extend this clas.')
      }

      return `{"$type":"Serializable","$class":"${data.constructor.name}","$value":${Serializer.stringify(data.serialize())}}`
    }

    if (typeof data === 'number') {
      return data
    }

    if (typeof data === 'string') {
      return `"${data.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`
    }

    if (data instanceof Date) {
      return `{"$type":"${data.constructor.name}","$value":${+data}}`
    }

    return `{"$type":"${data.constructor.name}","$value":"${data}"}`
  }

  /**
   * Parse JSON with Serializable support
   * @param {String} data
   */
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

      if (Class === Date) {
        return new Date(data.$value)
      }

      return 'parse' in Class
        ? Class.parse(data.$value)
        : Class(data.$value)
    }

    return parse(json)
  }
}

