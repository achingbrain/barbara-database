var Container = require('wantsit').Container,
  Nano = require('nano'),
  Columbo = require('columbo'),
  Hapi = require('hapi'),
  winston = require('winston'),
  path = require('path')

if(!process.env.BARBARA_COUCH_URL) {
  throw new Error('Specify a BARBARA_COUCH_URL environmental variable')
}

if(!process.env.BARBARA_PORT) {
  throw new Error('Specify a BARBARA_PORT environmental variable')
}

var container = new Container()

// set up logging
var logger = container.createAndRegister('logger', winston.Logger, {
  transports: [
  new (winston.transports.Console)({
    timestamp: true,
    colorize: true
  })
  ]
})

// database
var connection = new Nano(process.env.BARBARA_COUCH_URL)
container.register('connection', Nano)

// create collections
connection.db.create('barbara_brews')
container.register('brewsDb', connection.use('barbara_brews'))

// handlers
container.createAndRegisterFunction('nanoErrorTranslator', 'translate', require('./lib/components/NanoErrorTranslator'))

// repositories
container.createAndRegister('brewRepository', require('./lib/repositories/BrewRepository'))

// create a REST api
container.createAndRegister('columbo', Columbo, {
  resourceDirectory: path.resolve(__dirname, './lib/resources'),
  resourceCreator: function(resource, name) {
    return container.createAndRegister(name + 'Resource', resource)
  },
  logger: logger
})

// start REST database server
var columbo = container.find('columbo')
var server = Hapi.createServer('0.0.0.0', process.env.BARBARA_PORT, {
  cors: true
})
server.route(columbo.discover())
server.ext('onPreResponse', container.find('nanoErrorTranslator'))
server.start(function() {
  logger.info('RESTServer', 'Running at', 'http://localhost:' + server.info.port)
})
