import axios from 'axios'

const baseUrl = '/api/blogs'
let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getBlogs = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createBlog = async blogProperties => {
  const config = {
    headers: { Authorization: token }
  }
  console.log(blogProperties)
  const response = await axios.post(baseUrl, blogProperties, config)
  return response.data
}

export default { 
  getBlogs,
  setToken,
  createBlog
}