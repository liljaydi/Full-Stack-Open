import { useState } from 'react'

const App = () => {
  const [counter, setCounter] = useState(0)

  const incrementCounter = () => {
    setCounter(counter + 1)
  }

  console.log(counter)

  return (
    <>
      <button onClick={incrementCounter}>counter</button>
      <p>{counter}</p>
    </>
  )

}

export default App