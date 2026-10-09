require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))

// this part is a middleware for logging request in the console
morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':body'))
app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const time = new Date()

  Person.countDocuments({}).then(count => {
    response.send(`
      <div>
        <p>Phonebook has info for ${count} people</p>
        <p>${time}</p>
      </div>
    `) 
  }) 
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(result => {
    if (result) response.json(result)
    else response.status(404).end()
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    if (result) response.status(204).end()
    else response.status(404).end()
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const newPerson = request.body
  const id = request.params.id

  Person.findByIdAndUpdate(id, newPerson, { returnDocument: 'after' }).then(result => {
    if (result) response.json(result)
    else response.status(404).end()
  }).catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') 
    return response.status(400).send({ error: 'Invalid id' })
  
  next(error)
}

app.use(errorHandler)