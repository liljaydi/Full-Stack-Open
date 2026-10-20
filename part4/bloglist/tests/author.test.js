const { test, describe } = require('node:test')
const assert = require('node:assert')
const { mostBlog, mostLike } = require('../utils/list_helper')
const { oneBlog, multipleBlogs } = require('./test_helper')

describe('author with the most blog', () => {
  test('when there is no blog is null', () => {
    assert.deepStrictEqual(mostBlog([]), null)
  })

  test('when there is only one blog is that blog', () => {
    assert.deepStrictEqual(mostBlog(oneBlog), {
      author: "Edsger W. Dijkstra",
      blogs: 1
    })
  })

  test('when there is multiple blogs is the correct author', () => {
    assert.deepStrictEqual(mostBlog(multipleBlogs), {
      author: "Robert C. Martin",
      blogs: 3
    })
  })
})

describe('author with the most Like', () => {
  test('when there is no blog is null', () => {
    assert.strictEqual(mostLike([]), null)
  })

  test('when there is only one blog is that blog', () => {
    assert.deepStrictEqual(mostLike(oneBlog), {
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('when there is multiple blogs is the correct blog', () => {
    assert.deepStrictEqual(mostLike(multipleBlogs), {
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
})