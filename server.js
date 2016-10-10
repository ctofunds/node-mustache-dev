const Koa = require('koa')
const path = require('path')
const serveStatic = require('koa-static')
const serveMustache = require('koa-mustache')

module.exports = function serve (config) {
  const { DEBUG, PUBLIC_FOLDER, TEMPLATE_EXT, PORT } = config
  const rootdir = path.join(__dirname, PUBLIC_FOLDER)
  console.log(rootdir)
  const port = PORT || 3000

  const app = new Koa()
  app.use(logger({ debug: DEBUG }))
  app.use(favicon())
  app.use(serveMustache(rootdir, { extension: TEMPLATE_EXT, debug: DEBUG }))
  app.use(serveStatic(rootdir))

  app.listen(port)
}

function logger (options) {
  return function (ctx, next) {
    options.debug && console.log('\nREQUEST PATH  :', ctx.path)
    return next()
  }
}

function favicon (options) {
  return function (ctx, next) {
    if (ctx.path === '/favicon.ico') {
      ctx.body = ''
    } else {
      return next()
    }
  }
}
