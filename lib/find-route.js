class FindRouteHelper {
  /**
   * @return {boolean}
   */
  constructor (url, routes) {
    url = url.trim()
      .replace(/^(\/)/, '')
      .replace(/(|\/)\?.*/, '')

    this.url = () => {
      return url
    }

    const parts = url.split('/')
    const count = parts.length
    let matches = []
    if (routes.hasOwnProperty(count)) {
      routes[count].forEach((route) => {
        let matched = url.match(route.pattern)
        if (matched) matches.push(route)
      })
    } else {
      return false
    }
  }

  static sortByWeight (suggested) {
    suggested.sort((a, b) => {
      return (b.weight - a.weight)
    })
    return suggested[0]
  }

  parseQuery () {
    let query = []
    this.url().replace(/^.*\?/, '').split('&')
      .forEach((arg) => {
        let pair = arg.split('=')
        if (pair.length === 2) {
          query.push({
            name: pair[0],
            value: pair[1]
          })
        }
      })
    return query
  }

  parseParams (parts, segments) {
    let params = []
    segments.forEach((segment, index) => {
      if (segment.charAt(0) === ':') {
        params.push({
          name: segment.substr(1),
          value: parts[index]
        })
      }
    })
    return params
  }

  findRoute (parts, routes) {
    switch (routes.length) {
      case 0:
        return false
      case 1: {
        return {
          route: routes[0].route,
          query: this.parseQuery(),
          params: this.parseParams(parts, routes[0].segments),
          meta: routes[0].meta
        }
      }
      default: {
        routes.forEach((routeInfo) => {
          routeInfo.weight = this.calcSuggestedWeight(parts, routeInfo.segments)
        })
        const route = FindRouteHelper.sortByWeight(routes)
        return {
          route: route.route,
          query: this.parseQuery(),
          params: this.parseParams(parts, route.segments),
          meta: route.meta
        }
      }
    }
  }

  calcSuggestedWeight (parts, route) {
    let weight = 0
    parts.forEach((part, index) => {
      if (part === route[index]) {
        weight += 400
      } else {
        if (route[index].charAt(0) !== ':') {
          weight -= 400
        } else {
          weight += 100
        }
      }
    })
    return weight
  }
}

module.exports = (url, routes) => {
  return new FindRouteHelper(url, routes)
}
