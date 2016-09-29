const fs = require('fs')
const path = require('path')
const { send } = require('micro')
const Mustache = require('mustache')
const attempts = require('attempts')

// const PUBLIC_FOLDER = 'views'
// const TEMPLATE_EXT = 'mustache'
const { PUBLIC_FOLDER, TEMPLATE_EXT, DEBUG } = require('./config.json')

module.exports = function (req, res) {
  DEBUG && console.log('\nREQUEST PATH  :', req.url)
  const pathname = req.url.replace(/(^\/)*(\/$)*/g, '') // trim '/'

  switch (pathname) {
    case 'favicon.ico':
      return send(res, 200)
    default:
      return send(res, 200, render(pathname) || 'no-matched-template-file')
  }
}

function render (pathname) {
  const p = resolveAvailableTemplate(pathname)
  if (!p) return ''
  DEBUG && console.log('FOUND TEMPLATE:', p + TEMPLATE_EXT)

  const tmpl = fs.readFileSync(p + TEMPLATE_EXT, 'utf-8')
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
function resolveAvailableTemplate (pathname) {
  return attempts.sync(p => {
    fs.accessSync(p, fs.R_OK)
    return p.replace(new RegExp(TEMPLATE_EXT + '$'), '')
  }, [
    path.join(__dirname, PUBLIC_FOLDER, pathname + '.' + TEMPLATE_EXT),
    path.join(__dirname, PUBLIC_FOLDER, pathname, 'index.' + TEMPLATE_EXT),
    path.join(__dirname, PUBLIC_FOLDER, pathname)
  ])
}
