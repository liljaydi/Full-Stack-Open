const Header = (props) => {
  console.log(props.course)
  return (
    <h1>{props.course}</h1>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part content={props.content[0]}/>
      <Part content={props.content[1]}/>
      <Part content={props.content[2]}/>
    </div>
  )
}

const Part = (props) => {
  console.log(props)
  return (
    <p>{props.content.part} {props.content.exercises}</p>
  )
}

const Total = (props) => {
  console.log(props.total)
  return (
    <p>Number of exercises {props.total}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const content = [
    { part : 'Fundamentals of React', exercises : 10},
    { part : 'Using props to pass data', exercises : 7},
    { part : 'State of a component', exercises : 14}
  ]

  return (
    <div>
      <Header course={course} />
      <Content content={content} />
      <Total total={content[0].exercises + content[1].exercises + content[2].exercises} />
    </div>
  )
}

export default App