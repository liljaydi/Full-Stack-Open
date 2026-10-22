const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const blogs = require('./test_helper').multipleBlogs
const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(blogs)
})

test('notes are returned as json and correct count', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, blogs.length)
})

test('notes have id property not _id', async () => {
  const response = await api.get('/api/blogs')
  assert.ok('id' in response.body[0])
  assert.ok(!('_id' in response.body[0]))
})

after(async () => {
  await mongoose.connection.close()
})