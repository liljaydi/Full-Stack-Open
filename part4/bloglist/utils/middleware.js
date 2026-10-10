const { info } = require('./logger')

const requestLogger = (request, response, next) => {
  info('method:', request.method)
  info('body:  ', request.body)
  info('---')
  next()
}

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  requestLogger,
  unknownEndpoint
}