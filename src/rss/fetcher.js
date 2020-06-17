import { RSSFeed } from './feed'
import { parser } from './parser'
import { Serializer } from '../serializer'

export class RSSFetcher {
  #feedTypes = new Map()

  /**
   * Add feed type
   */
  addFeed (regex, FeedClass) {
    Serializer.register(FeedClass)
    this.#feedTypes.set(regex, FeedClass)
  }

  /**
   * Fetch rss feed
   */
  async fetch (url) {
    const data = await parser.parseURL(url)

    const meta = { ...data }
    delete meta.items
    
    let FeedClass = RSSFeed

    for (const [regex, Feed] of this.#feedTypes) {
      if (regex.test(url)) {
        FeedClass = Feed
        break
      }
    }

    return data.items.map(item => new FeedClass(item, meta))
  }
}

