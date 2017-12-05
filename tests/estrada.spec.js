const chai = require('chai')
const expect = chai.expect
const estrada = require('./../lib/index')

const routes = [
  '/one',
  '/:one',
  '/one/two',
  '/:one/two',
  '/:one/:two',
  '/one/:two',
  '/one/two/three',
  '/one/two/three/four',
  '/one/two/three/four/five',
  '/one/two/three/four/five/six',
  '/one/two/three/four/five/six/seven'
]

const urls = [
  '/one',
  '/zero',
  '/one/two',
  '/one/three',
  '/zero/two'
]

const router = estrada(routes)

describe('Estrada module test', () => {
  it('should return import function', () => {
    expect(estrada instanceof Function).to.equal(true)
  })

  urls.forEach((url, index) => {
    it('match url #' + index, () => {
      let route = router.match(url)
      expect(route instanceof Object).to.equal(true)
    })
  })
})
