const estrada = require('./lib/index')
const util = require('util')
/**
 * Verbose message
 * @param msg
 */
const verbose = (msg) => {
  console.log(util.inspect(msg, false, null))
}

const routes = [
  '/:city/product/:name',
  {
    route: '/alive',
    meta: {foo: 'bar'}
  },
  '/:city',
  '/user/:user',
  '/user/:user/delete'
]

const router = estrada(routes)
router.match('/user/4/delete')
router.routes()
const route = router.match('/user/123/delete')
verbose(route)
