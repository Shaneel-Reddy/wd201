const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const { Todo } = require("./models");

// eslint-disable-next-line no-unused-vars
app.get("/todos", (request, response) => {
  console.log("TodoList");
});
app.post("/todos", async (request, response) => {
  console.log("Create a Todo List", request.body);
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: false,
    });
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.put("/todos/:id/markascompleted", async (request, response) => {
  console.log("Updating a Todo List", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedtodo = await todo.markAsCompleted();
    return response.json(updatedtodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
// eslint-disable-next-line no-unused-vars
app.delete("/todos/:id", (request, response) => {
  console.log("Deleting a Todo List", request.params.id);
});

module.exports = app;
