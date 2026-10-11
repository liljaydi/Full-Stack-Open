const info = require('./logger').info

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (favoriteBlog, blog) => {
    return blog.likes > favoriteBlog.likes
      ? blog
      : favoriteBlog
  }

  return blogs.length === 0
    ? null
    : blogs.reduce(reducer, blogs[0])
}

const mostBlog = (blogs) => {
  // logic: get the author with the most blogs

  // i first made an author collection using reduce
  // once i got the collection, 
  // i can iterate through them again and compare the number of blogs

  if (blogs.length === 0) return null

  const getAllAuthors = (authors, blog) => {
    // find if the current author already exist inside author collection
    const author = authors.find(author => author.author === blog.author)

    // if does not exist,
    // add it to the authors collection
    // and intialize its blogs count to 1
    if (!author) {
      authors.push({
        author: blog.author,
        blogs: 1
      })
      return authors

    // else if already existed, 
    // map out the existing collection
    // and plus one to the blogs count
    } else {
      return authors.map(author => {
        if (author.author === blog.author) {
          return {
            author: blog.author,
            blogs: author.blogs + 1
          }
        } else {
          return author
        }
      })
    }
  }

  const authors = blogs.reduce(getAllAuthors, [])

  // we can now iterate through the authors collection
  // and compare which author has the most blogs
  const getMostBlog = (mostBlog, blog) => {
    return blog.blogs > mostBlog.blogs
      ? blog
      : mostBlog
  }

  return authors.reduce(getMostBlog, authors[0])
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlog
}