const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const { Todo } = require("./models");
const path = require("path");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (request, response) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const allTodos = await Todo.getTodos();
    const overdueTodos = allTodos.filter(
      (todo) => todo.dueDate < today && !todo.completed,
    );
    const dueTodayTodos = allTodos.filter(
      (todo) => todo.dueDate === today && !todo.completed,
    );
    const dueLaterTodos = allTodos.filter(
      (todo) => todo.dueDate > today && !todo.completed,
    );

    if (request.accepts("html")) {
      response.render("index", {
        overdueTodos,
        dueTodayTodos,
        dueLaterTodos,
      });
    } else {
      response.json({
        allTodos,
      });
    }
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
});
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));

app.get("/todos", async (request, response) => {
  console.log("TodoList");
  try {
    const todos = await Todo.findAll();
    return response.json(todos);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.post("/todos", async (request, response) => {
  console.log("Create a Todo List", request.body);
  try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: false,
    });
    return response.redirect("/");
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

app.delete("/todos/:id", async (request, response) => {
  console.log("Deleting a Todo List", request.params.id);
  try {
    const deleted = await Todo.destroy({ where: { id: request.params.id } });
    return response.json(deleted ? true : false);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
