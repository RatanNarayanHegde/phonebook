import axios from "axios";
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

const Person = ({ person }) => {
  return (
    <p>
      {person.name} {person.number}
    </p>
  );
};

const Persons = ({ persons }) => {
  return persons.map((person) => <Person key={person.name} person={person} />);
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
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
      alert(` ${newName} is already present`);
      setNewName("");
      setNewNumber("");
      return;
    }
    const nameObject = {
      name: newName,
      number: newNumber,
    };
    setPersons(persons.concat(nameObject));
    setNewName("");
    setNewNumber("");
  };

  const personsToDisplay = persons.filter((person) =>
    person.name.toLowerCase().includes(nameFilter)
  );

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
      <Persons persons={personsToDisplay} />
    </div>
  );
};

export default App;
