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

  if (pathname === 'favicon.ico') return send(res, 200)

  const content = render(pathname)
  if (content) return send(res, 200, content)

  const file = readFile(pathname)
  if (file) return send(res, 200, file)

  return send(res, 404)
}

function readFile (pathname) {
  try {
    const p = path.join(__dirname, PUBLIC_FOLDER, pathname)
    DEBUG && console.log('SERVE FILE    :', p)
    return fs.readFileSync(p, { encoding: 'utf-8' })
  } catch (e) {
    DEBUG && console.error('404 NOT FOUND :', pathname)
    return ''
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
  const tmplPattern = new RegExp(TEMPLATE_EXT + '$')
  return attempts.sync(p => {
    if (tmplPattern.test(p)) {
      fs.accessSync(p, fs.R_OK)
      return p.replace(new RegExp(TEMPLATE_EXT + '$'), '')
    }
  }, [
    path.join(__dirname, PUBLIC_FOLDER, pathname + '.' + TEMPLATE_EXT),
    path.join(__dirname, PUBLIC_FOLDER, pathname, 'index.' + TEMPLATE_EXT),
    path.join(__dirname, PUBLIC_FOLDER, pathname)
  ])
}
