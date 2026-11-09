import { useState } from 'react'

const Blog = ({ blog, handleLikes, userId, handleDelete }) => {
  const [ view, setView ] = useState(false)

  const handleView = () => {
    setView(!view)
  }

  const blogStyle = {
    border: '1px solid black',
    padding: 4,
    marginBottom: 4,
  }

  const removeButton = {
    color: 'white',
    backgroundColor: 'darkRed',
    border: 'none',
    borderRadius: 4,
  }

  return (
    view
      ? <div style={blogStyle}>
          {blog.title} 
          <button onClick={handleView}>hide</button><br/>
          {blog.url}<br/>
          {blog.likes}<button onClick={() => handleLikes(blog)}>like</button><br/>
          {blog.author}<br/>
          {userId === blog.user.id && 
            <button 
              style={removeButton}
              onClick={() => handleDelete(blog)}
            >
              remove
            </button>}
        </div>
      : <div style={blogStyle}>
          {blog.title} {blog.author}
          <button onClick={handleView}>view</button>
        </div>
  )
}
export default Blog