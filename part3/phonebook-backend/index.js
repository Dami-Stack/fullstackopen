const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// --------------------
// Middleware
// --------------------
app.use(cors());
app.use(express.static("dist")); 
app.use(express.json());

// Custom morgan token to log request body (3.8)
morgan.token("body", (request) => {
  return JSON.stringify(request.body);
});

// Morgan logging middleware (3.7 + 3.8)
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

// --------------------
// Data
// --------------------
let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

// --------------------
// Routes
// --------------------

// 3.1 – Get all persons
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// 3.2 – Info page
app.get("/info", (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `);
});

// 3.3 – Get one person
app.get("/api/persons/:id", (request, response) => {
  const person = persons.find((p) => p.id === request.params.id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).json({ error: "person not found" });
  }
});

// 3.4 – Delete person
app.delete("/api/persons/:id", (request, response) => {
  persons = persons.filter((p) => p.id !== request.params.id);
  response.status(204).end();
});

// 3.5 & 3.6 – Add person with validation
app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  const nameExists = persons.some((p) => p.name === name);
  if (nameExists) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name,
    number,
  };

  persons = persons.concat(newPerson);
  response.json(newPerson);
});

// --------------------
// Unknown endpoint (3.6)
// --------------------
app.use((request, response) => {
  response.status(404).json({ error: "unknown endpoint" });
});

// --------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
