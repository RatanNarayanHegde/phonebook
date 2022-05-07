import personService from "./services/persons";
import { useState, useEffect } from "react";

const Filter = ({ handleChange, value }) => {
  return (
    <div>
      filter the names : <input onChange={handleChange} value={value} />
    </div>
  );
};

const PersonForm = ({
  onSubmit,
  handleNameChange,
  handleNumberChange,
  newName,
  newNumber,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input onChange={handleNameChange} value={newName} />
      </div>
      <div>
        number: <input onChange={handleNumberChange} value={newNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Person = ({ person, handleDelete }) => {
  return (
    <p>
      {person.name} {person.number}
      <button onClick={() => handleDelete(person.id)}>Delete</button>
    </p>
  );
};

const Persons = ({ persons, handleDelete }) => {
  return persons.map((person) => (
    <Person key={person.name} person={person} handleDelete={handleDelete} />
  ));
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleNameFilterChange = (event) => {
    const filter = event.target.value.toLowerCase();
    setNameFilter(filter);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleAddName = (event) => {
    event.preventDefault();

    const found = persons.find((person) => person.name === newName);
    if (found) {
      if (
        window.confirm(` ${newName} is already present do you want to update`)
      ) {
        // console.log(found);
        const updatedPerson = { ...found, number: newNumber };
        personService.update(updatedPerson).then((returnedPerson) => {
          // console.log(returnedPerson);
          setPersons(
            persons.map((person) =>
              person.id === returnedPerson.id ? returnedPerson : person
            )
          );
          setNewName("");
          setNewNumber("");
        });
      }
      setNewName("");
      setNewNumber("");
      return;
    }

    const nameObject = {
      name: newName,
      number: newNumber,
    };

    personService.create(nameObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
    });
  };

  const personsToDisplay = persons.filter((person) =>
    person.name.toLowerCase().includes(nameFilter)
  );

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete")) {
      personService.remove(id).then((returnedData) => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleChange={handleNameFilterChange} value={nameFilter} />
      <h2>Add a new</h2>
      <PersonForm
        onSubmit={handleAddName}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToDisplay} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
