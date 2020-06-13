export class URLTransformer {
  static transformers = new Map()

  static register (regex, transform) {
    URLTransformer.transformers.set(regex, transform)
  }

  static transform (url) {
    for (const [regex, transform] of URLTransformer.transformers) {
      const matches = regex.exec(url)
      if (matches && matches.length) {
        return transform(...matches)
      }
    }

    return url
  }
}
