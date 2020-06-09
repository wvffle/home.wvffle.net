import { RSSFetcher, RSSFeed, Store } from '/index.js'
import { MemoryStore } from './util/memory-store.js'

describe('Store', () => {
  it('should extend as MemoryStore and work correctly', () => {
    const store = new MemoryStore()

    store.meh = 6
    chai.expect(store.meh).to.equal(6)
  })

  it('getters/setters should work', () => {
    const store = new Store()
    store.test = 666
    chai.expect(store.test).to.equal(666)
  })

  it('getters should use cache', () => {
    const store = new Store()
    store.test = 666
    localStorage.test = 6
    chai.expect(store.test).to.equal(666)
  })

  it('should delete entry when set to undefined', () => {
    const store = new Store()
    store.test = undefined
    chai.expect(store.test).to.equal(undefined)
    chai.expect(localStorage.test).to.equal(undefined)
  })

  describe('#$set', () => {
    it('should set array item', () => {
      const store = new Store()
      store.test = [6]

      store.$set('test', 0, 666)
      chai.expect(store.test[0]).to.equal(666)
    })

    it('should add array item', () => {
      const store = new Store()
      store.test = [6]

      store.$set('test', 1, 666)
      chai.expect(store.test[1]).to.equal(666)
    })
  })
})

describe('RSS', () => {
  describe('Feed', () => {

  })

  describe('Fetcher', () => {
    describe('#addFeed', () => {
      it('should add and use custom feed correctly', async () => {
        class CustomFeed extends RSSFeed {}

        const fetcher = new RSSFetcher(new MemoryStore())
        fetcher.addFeed(/xkcd/, CustomFeed)
        const data = await fetcher.fetch('https://www.xkcd.com/rss.xml')
        chai.expect(data[0].constructor.name).to.equal('CustomFeed')
      })
    })
  })
})
