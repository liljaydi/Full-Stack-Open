const Blog = require('../models/blog')

// request all data from database (helper)
const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

// This are the data needed for some test
const blogs = [
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

// this data is used from a method that assumes every parameter passed is an array 
// hence we have to declare it as an array
const oneBlog = [blogs[1]]

// used only for object comparison
const mostLikeBlog = blogs[2]

const newBlog = {
  title: "ang ligid, ang tiil, and shark (ay shark), ang kanding",
  author: "ante",
  url: "facebook.com",
  likes: 4000000
}

const blogWithNoId = {
  title: "ang ligid, ang tiil, and shark (ay shark), ang kanding",
  author: "ante",
  url: "facebook.com"
}

const blogWithNoTitleAndUrl = {
  author: "ante",
  likes: 4000000
}

module.exports = {
  blogsInDb,
  oneBlog,
  blogs,
  mostLikeBlog,
  newBlog,
  blogWithNoId,
  blogWithNoTitleAndUrl
}