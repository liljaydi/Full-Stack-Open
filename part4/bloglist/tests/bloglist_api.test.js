const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const { blogsInDb, blogs } = require('./test_helper')
const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(blogs)
})

test('blog are returned as json and correct count', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, blogs.length)
})

test('blog have id property not _id', async () => {
  const response = await api.get('/api/blogs')
  assert.ok('id' in response.body[0])
  assert.ok(!('_id' in response.body[0]))
})

test('blog is added in database (increased count and correct data)', async () => {
  const newBlog = {
    title: "ang ligid, ang tiil, and shark (ay shark), ang kanding",
    author: "ante",
    url: "facebook.com",
    likes: 4000000
  }

  const savedBlog = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const blogsAtEnd = await blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogs.length + 1)

  const returnedBlog = blogsAtEnd.find(blog => 
    blog.title === "ang ligid, ang tiil, and shark (ay shark), ang kanding"
  )
  assert.deepStrictEqual(savedBlog.body, returnedBlog);
})

after(async () => {
  await mongoose.connection.close()
})