const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const { 
  blogsInDb, 
  blogs, 
  newBlog, 
  blogWithNoId,
  blogWithNoTitleAndUrl
} = require('./test_helper')
const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(blogs)
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
      .send(blogWithNoId)

    assert.deepStrictEqual(savedBlog.body, {
      ...blogWithNoId,
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
  const blogId = blogs[0]._id
  await api
    .delete(`/api/blogs/${blogId}`)
    .expect(204)

  const blogsAtEnd = await blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogs.length - 1)
})

test('a blog can be updated', async () => {
  const blogId = blogs[0]._id
  const updatedBlog = await api
    .patch(`/api/blogs/${blogId}`)
    .send({ likes: 14 })

  // this destructuring is for getting properties from blogs[0] except _id and __v
  // ...rest gets the remaining properties
  const { _id, __v, ...rest } = blogs[0]
  assert.deepStrictEqual(updatedBlog.body, {
    // since updatedBlog is returned with id property not _id
    // we need to remove _id property to compare, hence use ...rest
    // updatedBlog also doesnt include __v
    ...rest,
    id: _id,
    likes: 14
  })
})

after(async () => {
  await mongoose.connection.close()
})