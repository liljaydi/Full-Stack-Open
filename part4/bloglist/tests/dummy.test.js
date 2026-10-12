const { test, describe } = require('node:test')
const assert = require('node:assert')
const { 
  dummy, 
  totalLikes, 
  favoriteBlog, 
  mostBlog,
  mostLike
} = require('../utils/list_helper')
const info = require('../utils/logger').info

const oneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const multipleBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const mostLikeBlog = {
  _id: "5a422b3a1b54a676234d17f9",
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
  likes: 12,
  __v: 0
}

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
    assert.strictEqual(totalLikes(multipleBlogs), 36)
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
    assert.deepStrictEqual(favoriteBlog(multipleBlogs), mostLikeBlog)
  })
})

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

describe('most Like', () => {
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