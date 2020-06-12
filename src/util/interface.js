export const implement = (...Interfaces) => {
  const requiredMethods = {
    prototype: new Set(),
    static: new Set()
  }
  
  for (const Interface of Interfaces) {
    for (const key of Object.getOwnPropertyNames(Interface)) {
      if (typeof Interface[key] !== 'function') {
        continue
      }
      
      requiredMethods.static.add(key) 
    }
    
    for (const key of Object.getOwnPropertyNames(Interface.prototype)) {
      if (key === 'constructor') {
        continue
      }
      
      requiredMethods.prototype.add(key) 
    }
  }
  
  return (descriptor) => {
    const { elements } = descriptor

    const implIdx = elements.findIndex(({ key }) => key === '__implements__')
    const __implements__ = implIdx !== -1 
      ? elements[implIdx] 
      : {
        kind: 'field',
        placement: 'static',
        key: '__implements__',
        [Symbol.toStringTag]: 'Descriptor',
        descriptor: {
          configurable: true,
          enumerable: true,
          writable: true
        },
        initializer () {
          return new Set()
        }
      }

    const { initializer } = __implements__
    __implements__.initializer = function () {
      const set = initializer()
      for (const Interface of Interfaces) {
        set.add(Interface)
      }

      return set
    }

    if (implIdx === -1) {
      descriptor.elements.push(__implements__)
    } else {
      descriptor.elements[implIdx] = __implements__
    }

    for (const { kind, key, placement } of elements) {
      if (kind !== 'method') {
        continue
      }
      
      if (requiredMethods[placement].has(key)) {
        requiredMethods[placement].delete(key)
      }
    }
    
    const methods = [
      [...requiredMethods.prototype],
      [...requiredMethods.static].map(m => `static ${m}`)
    ].flat().join(', ')

    if (methods.length) {
      throw new Error(`Following methods are not implemented: ${methods}`) 
    }

    return descriptor
  }
}

export const Interface = ({ elements }) => {
  for (const { kind, key, descriptor: { value } } of elements) {
    if (kind !== 'method') {
      throw new Error(`Interface cannot contain any ${kind}s`)
    }
    
    if (value.toString() !== `function ${key}() {}`) {
      throw new Error(`'${key}' method cannot contain any body`)
    }
  }
}

export const isImplementing = (Class, ...Interfaces) => {
  return Class.__implements__ instanceof Set && Interfaces.every(Interface => Class.__implements__.has(Interface))
}
