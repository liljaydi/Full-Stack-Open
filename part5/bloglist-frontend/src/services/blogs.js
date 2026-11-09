import axios from 'axios'

const baseUrl = '/api/blogs'
let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

// request all blogs
const getBlogs = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

// create new blog
const createBlog = async blogProperties => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, blogProperties, config)
  return response.data
}

// update likes
const updateLikes = async blog => {
  const likes = { likes: blog.likes + 1 }
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.patch(`${baseUrl}/${blog.id}`, likes, config)
  return response.data
}

// delete a blog
const deleteABlog = async blogId => {
  const config = {
    headers: { Authorization: token }
  }
  await axios.delete(`${baseUrl}/${blogId}`, config)
}

export default {
  getBlogs,
  setToken,
  createBlog,
  updateLikes,
  deleteABlog
}