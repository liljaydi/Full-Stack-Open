// this prevents DNS connection error
require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8'])

// dependencies
const express = require('express')
const mongoose = require('mongoose')

// modules
const { MONGODB_URI } = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const { requestLogger, unknownEndpoint } = require('./utils/middleware')
const { info } = require('./utils/logger')

// express app
const app = express()

//connection to database
mongoose.connect(MONGODB_URI, { family: 4 })
.then(() => {
  info('connected to MongoDB')
})
.catch(error => next(error))

// middleware and routes
app.use(express.json())
app.use(requestLogger)
app.use('/api/blogs', blogsRouter)
app.use(unknownEndpoint)

module.exports = app