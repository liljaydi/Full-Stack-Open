import { useState } from 'react'

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad, total, average, positive }) => {
  if (total === 0) 
    return (
      <div>
        <h2>statistics</h2>
        <p>No feedback given</p>
      </div>
    )

  return (
    <div>
      <h2>statistics</h2>

      <table>
        <tbody>
          <StatisticLine text={'good'} value={good} />
          <StatisticLine text={'neutral'} value={neutral} />
          <StatisticLine text={'bad'} value={bad} />
          <StatisticLine text={'all'} value={total} />
          <StatisticLine text={'average'} value={average} />
          <StatisticLine text={'positive'} value={positive} />
        </tbody>
      </table>
    </div>
  )
}

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const handleGood = () => {
    console.log('handle good')

    const updatedGood = good + 1
    const updatedTotal = updatedGood + neutral + bad

    setGood(updatedGood)
    setTotal(updatedTotal)
    setAverage((updatedGood - bad) / updatedTotal)
    setPositive((updatedGood / updatedTotal) * 100)
  }

  const handleNeutral = () => {
    console.log('handle neutral')

    const updatedNeutral = neutral + 1
    const updatedTotal = good + updatedNeutral + bad

    setNeutral(updatedNeutral)
    setTotal(updatedTotal)
    setAverage((good - bad) / updatedTotal)
    setPositive((good / updatedTotal) * 100)
  }

  const handleBad = () => {
    console.log('handle bad')

    const updatedBad = bad + 1
    const updatedTotal = good + neutral + updatedBad

    setBad(updatedBad)
    setTotal(updatedTotal)
    setAverage((good - updatedBad) / updatedTotal)
    setPositive((good / updatedTotal) * 100)
  }

  return (
    <>
      <h2>give feedback</h2>
      <Button onClick={handleGood} text={'good'}/>
      <Button onClick={handleNeutral} text={'neutral'}/>
      <Button onClick={handleBad} text={'bad'}/>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        positive={positive}
      />
    </>
  )
}

export default App