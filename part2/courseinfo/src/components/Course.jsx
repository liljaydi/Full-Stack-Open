import Header from './Header'
import Content from './Content'

const Course = ({ course }) => {
    const { name, parts } = course

    const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0)

    return (
        <div>
            <Header header={name}/>
            {parts.map((part) => (
                <Content 
                    key={part.id} 
                    name={part.name} 
                    exercises={part.exercises}
                />
            ))}
            <h4>total of {totalExercises} exercises</h4>
        </div>
    )
}

export default Course