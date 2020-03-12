const proxy = require('http-proxy-middleware')

module.exports = app => {
  app.use(proxy('/endpoint', {target: 'http://backend:8010', ws: true}))
}
