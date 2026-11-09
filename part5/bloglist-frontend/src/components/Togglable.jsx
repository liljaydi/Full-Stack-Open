import { useState, useImperativeHandle } from 'react'

const Togglable = ({ buttonLabel, children, ref }) => {
  const [ display, setDisplay ] = useState(false)

  const handleDisplay = () => {
    setDisplay(!display)
  }

  useImperativeHandle(ref, () => {
    return { handleDisplay }
  })

  return (
    display 
      ? <>
          {children}
          <button onClick={handleDisplay}>cancel</button>
        </>
      : <button onClick={handleDisplay}>{buttonLabel}</button>
  )
}

export default Togglable