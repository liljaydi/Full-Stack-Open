import { useState, useEffect } from 'react'

// components
import Blog from './components/Blog'
import Notification from './components/Notification'

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

  // create new blog fields
  const [ title, setTitle ] = useState('')
  const [ author, setAuthor ] = useState('')
  const [ url, setUrl ] = useState('')

  // notification state
  // value should be an object { message, isError }
  const [ notification, setNotification ] = useState(null)

  // request all blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getBlogs()
        setBlogs(blogs)
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
      // error.response.data.error -> accesses backend error response
      notifyWith(error.response.data.error, true)
    }
  }

  // logout
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  // add new blog
  const addBlog = async event => {
    event.preventDefault()
    try {
      const newBlog = await blogService.createBlog({
        title, author, url
      })

      const newBlogs = [
        ...blogs,
        newBlog
      ]

      setBlogs(newBlogs)
      notifyWith(
        `A new blog ${newBlog.title} by ${newBlog.author} added`, 
        false,
      )
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      notifyWith(error.response.data.error, true)
    }
  }

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
      <div>
        <h2>create new</h2>
        <form onSubmit={addBlog}>
          <div>
            <label>
              title:
              <input 
                value={title}
                onChange={({ target }) => setTitle(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              author:
              <input 
                value={author}
                onChange={({ target }) => setAuthor(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              url:
              <input 
                value={url}
                onChange={({ target }) => setUrl(target.value)}
              />
            </label>
          </div>
          <button type='submit'>create</button>
        </form>
      </div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App