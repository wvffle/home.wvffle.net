export function implement (...Classes) {
  const set = new Set()
  
  for (const { prototype } of Classes) {
    for (const key of Object.getOwnPropertyNames(prototype)) {
      if (key === 'constructor') {
        continue
      }
      
      set.add(key) 
    }
  }
  
  return function ({ elements }) {
    for (const { kind, key } of elements) {
      if (kind !== 'method') {
        continue
      }
      
      if (set.has(key)) {
        set.delete(key)
      }
    }
    
    const methods = [...set].join(', ')
    throw new Error(`Following methods are not implemented: ${methods}`)
  }
}

export function Interface ({ elements }) {
  for (const { kind, key, descriptor: { value } } of elements) {
    if (kind !== 'method') {
      throw new Error(`Interface cannot contain any ${kind}s`)
    }
    
    if (value.toString() !== `function ${key}() {}`) {
      throw new Error(`'${key}' method cannot contain any body`)
    }
  }
}
