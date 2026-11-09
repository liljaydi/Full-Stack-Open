const { info } = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  info('method:', request.method)
  info('body:  ', request.body)
  info('---')
  next()
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  // authorization header contains...
  // "Bearer thisIsATokenValue"
  if (authorization && authorization.startsWith('Bearer ')) {
    // make "Bearer thisIsATokenValue" -> "thisIsATokenValue
    request.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor = async (request, response, next) => {
  // no token provided
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  // token is not valid or expired
  const token = jwt.verify(request.token, process.env.SECRET)
  if (!token.id) {
    return response.status(401).json({ error: "token invalid" })
  }

  // find user from token
  const user = await User.findById(token.id)
  if (!user) {
    return response.status(400).json({ error: "userId missing or not valid" })
  }
  request.user = user
  next()
}

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: 'token authentication failed' })
  }

  next(error)
}

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
}