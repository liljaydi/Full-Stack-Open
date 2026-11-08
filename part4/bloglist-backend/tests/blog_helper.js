const Blog = require('../models/blog')

// request all data from database (helper)
const blogsInDb = async () => {
  const blogs = await Blog.find({})
  // serialize data first then parse into a js object
  return blogs.map(blog => JSON.parse(JSON.stringify(blog)))
}

// This are the data needed for some test
const blogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: "gyde"
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    user: "gyde"
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    user: "gyde"
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    user: "jhondoe"
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    user: "jhondoe"
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    user: "jhondoe"
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

const blogWithNoLikes = {
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
  blogWithNoLikes,
  blogWithNoTitleAndUrl,
}