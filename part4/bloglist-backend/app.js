// this prevents DNS connection error
require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8'])

// dependencies
const express = require('express')
const mongoose = require('mongoose')

// env variable
const { MONGODB_URI } = require('./utils/config')

// routes
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

// middleware
const { 
  requestLogger,
  tokenExtractor,
  unknownEndpoint, 
  errorHandler 
} = require('./utils/middleware')

// helper function
const { info } = require('./utils/logger')

// express app
const app = express()

//connection to database
mongoose.connect(MONGODB_URI, { family: 4 })
.then(() => {
  info('connected to MongoDB')
})
.catch(error => {
  info('error connecting to MongoDB:', error.message)
})

// middleware and routes
app.use(express.json())
app.use(requestLogger)
app.use(tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app