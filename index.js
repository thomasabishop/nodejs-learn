const express = require("express");
const app = express(); // convention to name Express as the app
const port = process.env.PORT || 3000;
const Joi = require("joi");
const helmet = require("helmet");
const morgan = require("morgan");

// Middlewear
app.use(express.json());
app.use(helmet());

const courses = [
  {
    id: 1,
    name: "First course",
  },
  {
    id: 2,
    name: "Second course",
  },
  {
    id: 3,
    name: "Third course",
  },
];

if (app.get("env") === "development") {
  app.use(morgan("common"));
}

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(course);
  return error;
}

app.listen(port, () => console.log(`Listening on ${port}`));

// Return all data from API
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

// Return a specific value
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send("A course with the given ID was not found");
  res.send(course);
});

// Add a new course
app.post("/api/courses", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return error.details.map((joiErr) => res.status(400).send(joiErr.message));

  const course = {
    id: courses.length + 1,
    name: req?.body.name,
  };
  courses.push(course);
  res.send(course);
});

// Update a course
app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course)
    return res.status(404).send("A course with the given ID was not found");
  const { error } = validateCourse(req.body);

  if (error)
    return error.details.map((joiErr) => res.status(400).send(joiErr.message));

  course.name = req.body.name;
  res.send(course);
});

// Delete a course

app.delete("/api/course/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("A course with the given ID was not found");

  courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});
