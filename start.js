require('async-to-gen/register')

const serve = require('./server/index.js')
const config = require('./config.json')

serve(config)
console.log('listen on port', config.PORT)
