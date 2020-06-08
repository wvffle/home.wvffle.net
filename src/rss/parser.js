// NOTE: Overwriting parseURL method to automatically bypass CORS
RSSParser.prototype._parseURL = RSSParser.prototype.parseURL
RSSParser.prototype.parseURL = function (url) {
  return this._parseURL(`https://cors-anywhere.herokuapp.com/${url}`)
}

// RSS parser
export const parser = new RSSParser()

