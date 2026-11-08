const gydeUserData = {
  username: "jaydi",
  name: "Gyde",
  password: "gyde123"
}

const jhonDoeUserData = {
  username: "jhondoe",
  name: "Jhon Doe",
  password: "jhondoe123"
}

const userWithNoPassword = {
  username: 'johndoe11',
  name: 'John Doe'
}

const userWithInvalidPassword = {
  username: 'johndoe11',
  name: 'John Doe',
  password: 'jo'
}

const existingUsername = {
  username: 'jaydi',
  name: 'jjaydi',
  password: 'gyde123483y5thu'
}

const userWithNoUsername = {
  name: 'John Doe',
  password: 'John Doe'
}

module.exports = {
  gydeUserData,
  jhonDoeUserData,
  userWithNoPassword,
  userWithInvalidPassword,
  existingUsername,
  userWithNoUsername
}