const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// middleware
const userExtractor = require('../utils/middleware').userExtractor

blogsRouter.get('/', async (request, response ) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { ...blogProperties } = request.body
  const user = request.user

  const blog = new Blog({
    ...blogProperties,
    user: user.id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  // if logged in user id is not the same as blogs user id
  // reject delete
  if (!(blog.user.toString() === request.user.id.toString())) {
    return response.status(403).json({
      error: "you are not authorized to delete this blog" 
    })
  }

  await blog.deleteOne()
  response.status(204).end()
})

blogsRouter.patch('/:id', userExtractor, async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id, request.body, {
      // returns the new data state
      returnDocument: 'after',
    }
  )
  if (updatedBlog) response.json(updatedBlog)
  else response.status(404).end()
})

module.exports = blogsRouter