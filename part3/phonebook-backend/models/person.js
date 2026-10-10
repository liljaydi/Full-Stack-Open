require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8'])
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 }).then(() => {
  console.log('connected to MongoDB')
}).catch(error => {
  console.log('error connecting to MongoDB: ', error.message)
})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function(number) {
        const parts = number.split('-')
        let numberHasOneHyphen = false
        let partOneIsValid = false
        let partTwoIsValid = false

        if (parts.length === 2) numberHasOneHyphen = true

        if (numberHasOneHyphen) {
          if ((parts[0].length === 2 || parts[0].length === 3) && /^\d+$/.test(parts[0]))
            partOneIsValid = true
          if (/^\d+$/.test(parts[1]))
            partTwoIsValid = true
        }

        return partOneIsValid && partTwoIsValid
      },
      message: 'Number must contain 2–3 digits, followed by a hyphen (-) and additional digits.'
    }
  },
})

mongoose.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)