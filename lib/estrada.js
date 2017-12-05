const findRoute = require('./find-route')

class Estrada {
  constructor (routes) {
    let patterns = {}
    let route = ''
    let meta = {}
    let invalid = false

    routes.forEach((item) => {
      if ((typeof item === 'object')) {
        if (item.hasOwnProperty('route') && item.hasOwnProperty('meta')) {
          route = item.route
          meta = item.meta
        } else {
          invalid = true
        }
      } else {
        route = item
      }
      if (!invalid) {
        route = route.replace(/^\//, '')
        const pattern = /(:.[^/]+)/g
        const segments = route.split('/')
        const count = segments.length
        const regexp = new RegExp(`${route}$`
                    .replace(pattern, '(.[^/]*)'), 'g')

        let routeInfo = {
          pattern: regexp,
          segments: segments,
          route: `/${route}`,
          meta: meta
        }

        if (!patterns.hasOwnProperty(count)) {
          patterns[count] = [
            routeInfo
          ]
        } else {
          patterns[count].push(routeInfo)
        }
      }

      meta = {}
      route = ''
      invalid = false
    })

        /**
         * Getter for routes
         * @returns {*|Array}
         */
    this.routes = () => {
      return patterns || []
    }
  }

  match (url) {
    url = url
            .trim()
            .replace(/^(\/)/, '')
            .replace(/(|\/)\?.*/, '')
    const parts = url.split('/')
    const count = parts.length
    let matches = []
    if (this.routes().hasOwnProperty(count)) {
      this.routes()[count].forEach((route) => {
        let matched = url.match(route.pattern)
        if (matched) matches.push(route)
      })
    } else {
      return false
    }
    const frh = findRoute(url, this.routes())
    return frh.findRoute(parts, matches)
  }
}

module.exports = (routes) => {
  return new Estrada(routes)
}
