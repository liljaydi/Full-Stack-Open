const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
  },
  name: String,
  // set passwordhash required
  // even when backend already prevents that from happening
  passwordHash: {
    type: String,
    required: true,
  }
})

userSchema.set('toJSON', {
  transform: (document, returnedDocument) => {
    returnedDocument.id = document.id.toString()
    delete returnedDocument._id
    delete returnedDocument.__v
    delete returnedDocument.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)