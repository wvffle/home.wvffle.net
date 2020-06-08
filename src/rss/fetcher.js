import { RSSFeed } from './feed'
import { parser } from './parser'

export class RSSFetcher {
  constructor (store) {
    if (!store.feedTypes) {
      store.feedTypes = []
    }

    this.store = store
  }

  addFeed (regex, Feed) {
    this.store.$set('feedTypes', store.feedTypes.length, { 
      regex, Feed
    })
  }

  /**
   * Fetch rss feed
   */
  async fetch (url) {
    const data = await parser.parseURL(url)

    const meta = { ...data }
    delete meta.items
    
    let FeedClass = RSSFeed
    for (const { regex, Feed } of this.store.feedTypes) {
      if (regex.test(url)) {
        FeedClass = Feed
        break
      }
    }

    return data.items.map(item => new FeedClass(item, meta))
  }
}

