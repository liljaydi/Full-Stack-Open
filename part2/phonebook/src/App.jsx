import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  let personsToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const addPhoneBook = (e) => {
    e.preventDefault();

    const nameExisted = persons.some(person => person.name === newName)

    console.log(nameExisted)

    if (nameExisted) {
      alert(`${newName} is already added to phonebook`)
      console.log("name existed")
      return
    }

    const personObj = {
      name: newName,
      number: newNumber
    }

    setPersons(persons.concat(personObj))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleFilterChange = (e) => setNewFilter(e.target.value)

  return (
    <>
      <h2>Phonebook</h2>

      <Filter 
        newFilter={newFilter}
        handleFilterChange={handleFilterChange}
      />

      <h3>Add a new</h3>

      <PersonForm
        addPhoneBook={addPhoneBook}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      
      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow}/>
    </>
  )
}

export default App