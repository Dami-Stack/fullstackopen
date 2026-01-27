const express = require("express");
const app = express();

// Middleware to parse JSON bodies (REQUIRED for POST)
app.use(express.json());

// Hardcoded phonebook data (3.1)
let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

// ----------------------------------------------------
// 3.1 – Get all persons
// ----------------------------------------------------
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// ----------------------------------------------------
// 3.2 – Info page
// ----------------------------------------------------
app.get("/info", (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `);
});

// ----------------------------------------------------
// 3.3 – Get single person by id
// ----------------------------------------------------
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).json({ error: "person not found" });
  }
});

// ----------------------------------------------------
// 3.4 – Delete a person
// ----------------------------------------------------
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  persons = persons.filter((p) => p.id !== id);

  // 204 = successful but no content returned
  response.status(204).end();
});

// ----------------------------------------------------
// 3.5 & 3.6 – Add new person with validation
// ----------------------------------------------------
app.post("/api/persons", (request, response) => {
  const body = request.body;

  // Validation: missing name or number
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  // Validation: name must be unique
  const nameExists = persons.some((p) => p.name === body.name);
  if (nameExists) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);
  response.json(newPerson);
});

// ----------------------------------------------------
// 3.6 – Unknown endpoint handler
// (must be last!)
// ----------------------------------------------------
app.use((request, response) => {
  response.status(404).json({
    error: "unknown endpoint",
  });
});

// ----------------------------------------------------
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
