const { test, describe } = require('node:test')
const assert = require('node:assert')
const favoriteBlog = require('../utils/list_helper').favoriteBlog
const { oneBlog, blogs, mostLikeBlog } = require('./test_helper')

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