/* eslint-disable no-undef */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Todo } = require("./models");
const path = require("path");
var csrf = require("tiny-csrf");
var cookieParser = require("cookie-parser");

app.use(cookieParser("your_secret_key"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(csrf("this_should_be_exactly_32_chars!", ["PUT", "POST", "DELETE"]));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

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
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({
        overdueTodos,
        dueTodayTodos,
        dueLaterTodos,
      });
    }
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
});

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
  console.log("Received CSRF Token:", request.body._csrf);
  console.log("CSRF Token from cookies:", request.csrfToken());
  try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: false,
    });
    return response.redirect("/");
  } catch (error) {
    console.error("Error creating todo:", error);
    return response.status(422).json({ error: error.message });
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
    await Todo.remove(request.params.id);
    return response.json({ sucess: true });
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
