import { RSSFetcher, RSSFeed } from '/index.js'

describe('RSSFetcher', () => {
  describe('#fetch', () => {
    it('should fetch data', async () => {
      const fetcher = new RSSFetcher()

      // NOTE: This may fail as cors-anywhere may return 429
      const data = await fetcher.fetch('https://www.xkcd.com/rss.xml')
      chai.expect(typeof data).to.be.eq('object')
      chai.expect(data.length).to.be.gt(0)
    })
  })

  describe('#addFeed', () => {
    it('should add and use custom feed correctly', async () => {
      class CustomFeed extends RSSFeed {}

      const fetcher = new RSSFetcher()
      fetcher.addFeed(/xkcd/, CustomFeed)
      const data = await fetcher.fetch('https://www.xkcd.com/rss.xml')
      chai.expect(data[0].constructor.name).to.equal('CustomFeed')
    })
  })
})
