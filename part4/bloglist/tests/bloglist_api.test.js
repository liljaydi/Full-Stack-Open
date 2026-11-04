// npm test --test tests/bloglist_api.test.js

const { before, beforeEach, describe, test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')

// blog test data
const { 
  blogsInDb, 
  blogs, 
  newBlog, 
  blogWithNoLikes,
  blogWithNoTitleAndUrl
} = require('./blog_helper')

// user test data
const { 
  gydeUserData, 
  jhonDoeUserData,
  userWithNoPassword,
  userWithInvalidPassword,
  existingUsername,
  userWithNoUsername
} = require('./user_helper')

// app module is all of the backend functionality
// except that it is not listening to a port
const app = require('../app')

// for test integration
const supertest = require('supertest')

// lets supertest handles the request
const api = supertest(app)

// models
const Blog = require('../models/blog')
const User = require('../models/user')

// global variable
let gydeLogin
let jhonDoeLogin

before(async () => {
  await User.deleteMany({})

  // register a user in database
  const gydeAccount = await api.post('/api/users').send(gydeUserData).expect(201)
  const jhonDoeAccount = await api.post('/api/users').send(jhonDoeUserData).expect(201)

  // get user credential before logging in
  const { name: gyde, ...gydeCredentials } = gydeUserData
  const { name: jhonDoe, ...jhonDoeCredentials } = jhonDoeUserData

  // login gyde account
  gydeLogin = await api
    .post('/api/login')
    .send({ ...gydeCredentials })
    .expect(200)

  // login jhon doe account
  jhonDoeLogin = await api
    .post('/api/login')
    .send({ ...jhonDoeCredentials })
    .expect(200)
  
  // add id inside login's since login request 
  // does not return the id of the user
  gydeLogin = { ...gydeLogin.body, id: gydeAccount.body.id }
  jhonDoeLogin = { ...jhonDoeLogin.body, id: jhonDoeAccount.body.id }
})

beforeEach(async () => {
  await Blog.deleteMany({})

  // replace initial user property value with the actual id
  const blogsWithUserIds = blogs.map(blog => ({
    ...blog,
    user: blog.user === 'gyde'
      ? gydeLogin.id
      : jhonDoeLogin.id
    })
  )

  await Blog.insertMany(blogsWithUserIds)
})

describe('blogs are returned', () => {
  test('as json and correct count', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, blogs.length)
  })

  test('with id property not _id', async () => {
    const response = await api.get('/api/blogs')
    assert.ok('id' in response.body[0])
    assert.ok(!('_id' in response.body[0]))
  })
})

describe('adding blog in database', () => {
  test('increases count and successfuly creates data', async () => {
    const savedBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${gydeLogin.token}`)
      .expect(201)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogs.length + 1)

    const returnedBlog = blogsAtEnd.find(blog => 
      blog.id === savedBlog.body.id
    )

    // NB: toJSON() is not the same as json serialization
    // response.json(savedBlog) returns a serialized data
    // while blog.toJSON() returns a plain JS object using Mongoose's toJSON configuration.
    // so data from request (with .json()) !== data that is proccesed with toJSON()

    assert.deepStrictEqual(savedBlog.body, returnedBlog)
  })

  // npm test -- --test-name-pattern="with no likes property is automatically added and set value to 0"
  test('with no likes property is automatically added and set value to 0', async () => {
    const savedBlog = await api
      .post('/api/blogs')
      .send(blogWithNoLikes)
      .set('Authorization', `Bearer ${gydeLogin.token}`)

    assert.deepStrictEqual(savedBlog.body, {
      ...blogWithNoLikes,
      id: savedBlog.body.id,
      likes: 0,
      user: gydeLogin.id
    })
  })

  // npm test -- --test-name-pattern="with no title or url is responded with status 400"
  test('with no title or url is responded with status 400', async () => {
    const savedBlog = await api
      .post('/api/blogs')
      .send(blogWithNoTitleAndUrl)
      .set('Authorization', `Bearer ${gydeLogin.token}`)
      .expect(400)
  })
})

// npm test -- --test-name-pattern="a blog can be deleted"
test('a blog can be deleted', async () => {
  const blog = await Blog.findOne({ title: "React patterns" })
  const blogId = blog.id

  await api
    .delete(`/api/blogs/${blogId}`)
    .set('Authorization', `Bearer ${gydeLogin.token}`)
    .expect(204)

  const blogsAtEnd = await blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogs.length - 1)
})

test('a blog can be updated', async () => {
  const blog = await Blog.findOne({ title: "React patterns" })
  const blogId = blog.id

  // change likes from 7 to 14
  const updatedBlog = await api
    .patch(`/api/blogs/${blogId}`)
    .send({ likes: 14 })

  const { likes, user, ...rest } = blogs[0]
  assert.deepStrictEqual(updatedBlog.body, {
    ...rest,
    id: updatedBlog.body.id,
    likes: 14,
    user: gydeLogin.id
  })
})

describe('adding users in database', () => {
  test('with no password returns an error', async () => {
    const addedUser = await api
      .post('/api/users')
      .send(userWithNoPassword)
      .expect(400)

    assert.deepStrictEqual(addedUser.body, { error: 'password is required' })
  })

  test('with invalid password returns an error', async () => {
    const addedUser = await api
      .post('/api/users')
      .send(userWithInvalidPassword)
      .expect(400)

    assert.deepStrictEqual(addedUser.body, { 
      error: 'password must be atleast 3 characters long' 
    })
  })

  test('with existing username returns an error', async () => {
    const savedUser = await api
      .post('/api/users')
      .send(existingUsername)
      .expect(400)

    assert.deepStrictEqual(savedUser.body, {
      error: 'expected `username` to be unique' 
    })
  })

  test('with no username returns an error', async () => {
    const savedUser = await api
      .post('/api/users')
      .send(userWithNoUsername)
      .expect(400)

    assert.deepStrictEqual(savedUser.body, {
      error: 'User validation failed: username: Path `username` is required.'
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})