const { test, describe } = require('node:test')
const assert = require('node:assert')

// list helper functions from utils
const { 
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlog,
  mostLike
} = require('../utils/list_helper')

// test data
const { 
  oneBlog,
  blogs,
  mostLikeBlog
} = require('./blog_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(totalLikes([]), 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    assert.strictEqual(totalLikes(oneBlog), 5)
  })

  test('of a bigger list is calculated right', () => {
    assert.strictEqual(totalLikes(blogs), 36)
  })
})

describe('most like blog', () => {
  test('of empty list is null', () => {
    assert.strictEqual(favoriteBlog([]), null)
  })

  test('when list has only one blog is that blog', () => {
    assert.deepStrictEqual(favoriteBlog(oneBlog), oneBlog[0])
  })

  test('of a bigger list returns the correct blog', () => {
    assert.deepStrictEqual(favoriteBlog(blogs), mostLikeBlog)
  })
})

// This test checks the author with the most blogs post
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
    assert.deepStrictEqual(mostBlog(blogs), {
      author: "Robert C. Martin",
      blogs: 3
    })
  })
})

// this test checks the author that has the most liked blog
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
    assert.deepStrictEqual(mostLike(blogs), {
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
})