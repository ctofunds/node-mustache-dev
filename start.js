require('async-to-gen/register')

const serve = require('./server.js')
const config = require('./config.json')

serve(config)
console.log('listen on port', config.PORT)
