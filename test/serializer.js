import { Serializer, Serializable } from '/index.js'

class CustomSerializable extends Serializable {
  constructor (value) {
    super()
    this.value = value
  }

  serialize () {
    return this.value
  }

  static deserialize (value) {
    return { value }
  }
}

const obj = {
  number: 6,
  string: '8',
  customSer: new CustomSerializable(888),
  date: new Date()
}

describe('Serializer', () => {
  describe('#register', () => {
    it('should register new Serializable class', () => {
      Serializer.register(CustomSerializable)
      chai.expect(Serializer.cache.CustomSerializable).to.be.eq(CustomSerializable)
    })
  })

  describe('#stringify', () => {
    it('should stringify as correct parsible JSON', () => {
      const jsonString = Serializer.stringify(obj)
      JSON.parse(jsonString)
    })
  })

  describe('#parse', () => {
    it('should parse correctly', () => {
      const json = Serializer.parse(`{"number":6,"string":"8","customSer":{"$type":"Serializable","$class":"CustomSerializable","$value":888},"date":{"$type":"Date","$value":${+obj.date}}}`)
      chai.expect(json).to.be.deep.eq(obj)
    })
  })
})
