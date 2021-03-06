import React from 'react'
import personService from '../services/persons'

const PersonForm = ({persons, setPersons, newName, setNewName, newNumber, setNewNumber, setNotificationMessage}) => {
  const addName = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }

    if (persons.some(person => person.name === newName)) {
      const existingPerson = persons.find(person => person.name === newName)
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
        .update(existingPerson.id, newPerson)
        .then(returnedPerson => {
          setPersons(persons.map(pers => pers.id !== existingPerson.id ? pers : returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotificationMessage({message:`Changed ${newName}'s number to ${newNumber}`, type:'notificaiton'})
          setTimeout(() => {
            setNotificationMessage({message: null, type: null})
          }, 5000)
        })
        .catch(() => {
          setNotificationMessage({message:`Information of ${newName} has already been removed from server`, type:'error'})
          setTimeout(() => {
            setNotificationMessage({message: null, type: null})
          }, 5000)
          setPersons(persons.filter(person => person.id !== existingPerson.id))
          setNewName('')
          setNewNumber('')
        })
      }
    }
    else {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotificationMessage({message:`Added ${newName}`, type:'notification'})
          setTimeout(() => {
            setNotificationMessage({message: null, type: null})
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <form onSubmit={addName}>
        <div>
          name:
          <input
          value={newName}
          onChange={handleNameChange}
          />
        </div>
        <div>
          number:
          <input
          value={newNumber}
          onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

export default PersonForm