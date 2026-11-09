import { useState, useEffect, useRef } from 'react'

// components
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

// services
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
  const initializeUser = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      blogService.setToken(loggedUser.token)
      return loggedUser
    } else {
      return null
    }
  }

  const [ user, setUser ] = useState(initializeUser())
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ blogs, setBlogs ] = useState([])

  // notification state
  // value should be an object { message, isError }
  const [ notification, setNotification ] = useState(null)

  // blogForm referrence
  const blogFormRef = useRef()

  // sort blogs according to number of likes
  const sortBlogs = blogs => {
    // b.likes - a.likes = result
    // if result is negative, right value comes first
    // if result is positive, left value comes first
    return blogs.sort((a, b) => b.likes - a.likes)
  }

  // request all blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getBlogs()
        const sortedBlogs = sortBlogs(blogs)
        setBlogs(sortedBlogs)
      } catch {
        console.log('request blog failed')
      }
    }
    fetchBlogs()
  }, [])

  // login
  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

      setUser(user)
      console.log(`${user.name} logged in`)
      setUsername('')
      setPassword('')

      blogService.setToken(user.token)
    } catch (error) {
      handleErrorMessage(error)
    }
  }

  // logout
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  // add new blog
  const addBlog = async blogProperties => {
    try {
      const newBlog = await blogService.createBlog(blogProperties)

      const newBlogs = [
        ...blogs,
        newBlog
      ]

      const sortedBlogs = sortBlogs(newBlogs)
      setBlogs(sortedBlogs)
      notifyWith(
        `A new blog ${newBlog.title} by ${newBlog.author} added`, 
        false,
      )
      blogFormRef.current.handleDisplay()
    } catch (error) {
      handleErrorMessage(error)
      throw error
    }
  }

  // update blogs likes
  const handleLikes = async blogToUpdate => {
    const previousBlogState = blogs
    const updatedBlogs = blogs.map(blog => blog.id === blogToUpdate.id
      ? {
          ...blogToUpdate,
          likes: blogToUpdate.likes + 1
        }
      : blog
    )
    const sortedBlogs = sortBlogs(updatedBlogs)
    setBlogs(sortedBlogs)
    try {
      await blogService.updateLikes(blogToUpdate)
    } catch (error) {
      handleErrorMessage(error)
      setBlogs(previousBlogState)
    }
  }

  // delete a blog
  const handleDelete = async blogToDelete => {
    if (!window.confirm(
      `remove blog ${blogToDelete.title} by ${blogToDelete.author}`
    )) {
      return
    }

    try {
      await blogService.deleteABlog(blogToDelete.id)
      const filteredBlogs = blogs.filter(blog => blog.id !== blogToDelete.id)
      setBlogs(filteredBlogs)
    } catch (error) {
      handleErrorMessage(error)
    }
  }

  // handle error message to be sent with notification
  const handleErrorMessage = error => {
    if (error.response.data.error) {
      notifyWith(error.response.data.error, true)
    } else {
      notifyWith(error.message, true)
    }
  }

  // handles notification functionality
  const notifyWith = (message, isError) => {
    setNotification({ 
      message: message, 
      // ?? -> if left value (isError) is null set value to false
      isError: isError ?? false
    })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        {notification && <Notification notification={notification}/>}

        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input 
                value={username} 
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input 
                type='password'
                value={password} 
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      {notification && <Notification notification={notification}/>}
      
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>

      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>

      {blogs.map(blog =>
        <Blog 
          key={blog.id} 
          blog={blog} 
          handleLikes={handleLikes}
          userId={user.id}
          handleDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default App