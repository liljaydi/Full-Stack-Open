const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')

// test data
const { 
  blogsInDb, 
  blogs, 
  newBlog, 
  blogWithNoLikes,
  blogWithNoTitleAndUrl,
  users,
  userWithNoPassword,
  userWithInvalidPassword,
  existingUsername,
  userWithNoUsername
} = require('./test_helper')

// app module is all of the backend functionality
// except that it is not listening to a port
const app = require('../app')
// for test integration
const supertest = require('supertest')

// let supertest handles the request
const api = supertest(app)

// models
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(blogs)
  await User.deleteMany({})
  await User.insertMany(users)
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
      .expect(201)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogs.length + 1)

    const returnedBlog = blogsAtEnd.find(blog => 
      blog.id === savedBlog.body.id
    )
    assert.deepStrictEqual(savedBlog.body, returnedBlog);
  })

  test('with no likes property is automatically added and set value to 0', async () => {
    const savedBlog = await api
      .post('/api/blogs')
      .send(blogWithNoLikes)

    assert.deepStrictEqual(savedBlog.body, {
      ...blogWithNoLikes,
      id: savedBlog.body.id,
      likes: 0
    })
  })

  test('with no title or url is responded with status 400', async () => {
    const savedBlog = await api
      .post('/api/blogs')
      .send(blogWithNoTitleAndUrl)
      .expect(400)
  })
})

test('a blog can be deleted', async () => {
  const blog = await Blog.findOne({ author: "Michael Chan" })
  const blogId = blog.id

  await api
    .delete(`/api/blogs/${blogId}`)
    .expect(204)

  const blogsAtEnd = await blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogs.length - 1)
})

test('a blog can be updated', async () => {
  const blog = await Blog.findOne({ author: "Michael Chan" })
  const blogId = blog.id

  // change likes from 7 to 14
  const updatedBlog = await api
    .patch(`/api/blogs/${blogId}`)
    .send({ likes: 14 })

  const { likes, ...rest } = blogs[0]
  assert.deepStrictEqual(updatedBlog.body, {
    ...rest,
    id: updatedBlog.body.id,
    likes: 14
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