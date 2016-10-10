const fs = require('fs')
const path = require('path')
const attempts = require('attempts')
const Mustache = require('mustache')

let DEBUG = false

module.exports = function (rootpath, opts = { ext: 'mustache', debug: false }) {
  DEBUG = opts.debug

  return function mustache (ctx, next) {
    if (ctx.method === 'GET') {
      const p = path.join(rootpath, ctx.path)
      const content = render(p, opts.ext)
      if (content) {
        ctx.body = content
      } else {
        return next()
      }
    }
  }
}

function render (pathname, ext) {
  const p = resolveAvailableTemplate(pathname, ext)
  if (!p) return ''
  DEBUG && console.log('FOUND TEMPLATE:', p + ext)

  const tmpl = fs.readFileSync(p + ext, 'utf-8')
  const data = attempts.sync(p => require(p), [p + 'json', p + 'data.js'])
  DEBUG && console.log('RENDER DATA   :', data)
  return Mustache.render(tmpl, data)
}

/**
 * resolveAvailableTemplate
 *
 * '/', '/index', '/index.mustache' will resolved to 'views/index.mustache'
 *
 * @param  {String} pathname
 * @return {String|undefined}
 */
function resolveAvailableTemplate (pathname, ext) {
  const tmplPattern = new RegExp(ext + '$')
  return attempts.sync(p => {
    if (tmplPattern.test(p)) {
      fs.accessSync(p, fs.R_OK)
      return p.replace(new RegExp(ext + '$'), '')
    }
  }, [
    path.join(pathname + '.' + ext),
    path.join(pathname, 'index.' + ext),
    pathname
  ])
}
