import { Serializable, Serializer } from '../serializer'
import { implement } from '../util/interface'
import { e } from '../waff-query'


export @implement(Serializable) class RSSFeed {
  constructor (data, meta) {
    this.data = data
    this.meta = meta
    this.date = new Date(data.pubDate)
  }

  /**
   * Renders the feed
   * @returns {HTMLElement}
   */
  render () {
    const img = e('img.h-8.w-8.flex-shrink-0.mr-4')
    img.src = `https://besticon-demo.herokuapp.com/icon?size=32..48..80&url=${this.meta.link}`

    const a = e('a.flex.items-center',
      img,
      e('.truncate.w-full',
        e('h1.font-bold.font-lg.text-gray-800', this.title),
        e('.text-gray-700.text-xs.font-mono', this.date.toLocaleString())
      )
    )

    a.href = this.data.link

    const res = e(`.m-10.shadow-lg.rounded-lg.p-6.pt-4.bg-white`, 
      a,
      e('.content.text-gray-900.pt-4', this.content)
    )

    // FIXME: Remove when https://github.com/MethodGrab/firefox-custom-new-tab-page/issues/1 is fixed
    for (const a of res.querySelectorAll('a')) {
      a.target = '_top'
    }

    return res
  }

  /**
   * Rendered content
   */
  get content () {
    return this.data.content
  }

  /**
   * Rendered title
   */
  get title () {
    return this.data.title
  }

  /**
   * Check if RSSFeed should be visible or not
   */
  get visible () {
    return true
  }

  /**
   * @inheritdoc
   * @override
   */
  serialize () {
    const { data, meta } = this
    return { data, meta }
  }

  /**
   * @inheritdoc
   * @override
   */
  static deserialize ({ data, meta }, FeedClass) {
    return new FeedClass(data, meta)
  }
}

Serializer.register(RSSFeed)

