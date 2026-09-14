import { useState, useEffect } from 'react'
import personService from './services/persons'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')

  const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(newFilter.toLowerCase()))

  useEffect(() => {
    console.log('effect')
    personService.getAll()
    .then(initialPersons => {
      console.log('data recieved')
      setPersons(initialPersons)
    })
  }, [])
  console.log('total persons ' + persons.length)

  const addPerson = (e) => {
    e.preventDefault();

    const personExisted = persons.find(person => 
      person.name.toLowerCase() === newName.toLowerCase()
    )

    if (personExisted) {
      console.log("name existed")
      if (window.confirm(`
        ${newName} is already added to phonebook, 
        replace the old number with a new one?
      `)) {
        updatePerson(personExisted)
      }
      return
    }

    console.log('adding new person...')

    const personObj = {
      name: newName,
      number: newNumber
    }

    personService.create(personObj)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))

      setNewName('')
      setNewNumber('')
      console.log(returnedPerson)

      setNotificationMessage(`Added ${returnedPerson.name}`)
      setTimeout(() => {
        setNotificationMessage('')
      }, 5000)  
    })
  }

  function updatePerson(person) {
    const changedPerson = {...person, number: newNumber}

    personService.update(person.id, changedPerson)
    .then(returnedPerson => {
      setPersons(persons.map(person =>
        person.id === returnedPerson.id
          ? returnedPerson
          : person
      ))

      setNewName('')
      setNewNumber('')
      console.log(`${returnedPerson.name} updated`)

      setNotificationMessage(`updated ${returnedPerson.name} number`)
      setTimeout(() => {
        setNotificationMessage('')
      }, 5000)
    })
    .catch(error => {
      setNotificationMessage(`
        Information of ${person.name} has already been removed from server
      `)

      setPersons(persons.filter(n => n.id !== person.id))
      
      setTimeout(() => {
        setNotificationMessage('')
      }, 5000)
    })
  }

  const deletePerson = ({ id, name }) => {
    console.log(`delete ${name}?`)
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id)
      .then(returnedPerson => {
        setPersons(persons.filter(person => person.id !== id))
        console.log(`${returnedPerson.name} deleted`)
      })
    } else {
      console.log('delete canceled')
    }
  }

  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleFilterChange = (e) => setNewFilter(e.target.value)

  return (
    <>
      <h2>Phonebook</h2>

      {notificationMessage !== ''
        ? <Notification notificationMessage={notificationMessage}/>
        : <></>
      }
      
      <Filter 
        newFilter={newFilter}
        handleFilterChange={handleFilterChange}
      />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      
      <h3>Numbers</h3>

      <Persons 
        personsToShow={personsToShow}
        deletePerson={deletePerson}  
      />
    </>
  )
}

export default App