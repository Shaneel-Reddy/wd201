/* eslint-disable no-undef */
const express = require("express");
const app = express();
const { Todo } = require("./models");
const path = require("path");
var csrf = require("tiny-csrf");
var cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("your_secret_key"));
app.use(csrf("this_should_be_exactly_32_chars!", ["PUT", "POST", "DELETE"]));
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
    const completedTodos = allTodos.filter((todo) => todo.completed);
    if (request.accepts("html")) {
      response.render("index", {
        overdueTodos,
        dueTodayTodos,
        dueLaterTodos,
        completedTodos,
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

// app.get("/todos", async (request, response) => {
//   console.log("TodoList");
//   try {
//     const todos = await Todo.findAll();
//     return response.json(todos);
//   } catch (error) {
//     console.log(error);
//     return response.status(422).json(error);
//   }
// });
app.post("/todos", async (request, response) => {
  const { title, dueDate } = request.body;

  if (!title || !title.trim() || !dueDate) {
    return response
      .status(422)
      .json({ error: "Title and due date are required." });
  }
  try {
    await Todo.addTodo({
      title: title.trim(),
      dueDate: dueDate,
      completed: false,
    });
    return response.redirect("/");
  } catch (error) {
    console.error("Error creating todo:", error);
    return response.status(422).json({ error: error.message });
  }
});
app.put("/todos/:id", async (request, response) => {
  const { completed } = request.body;
  const { id } = request.params;
  try {
    const updatedTodo = await Todo.setCompletionStatus(id, completed);
    if (!updatedTodo) {
      return response.status(404).send("Todo not found");
    }
    const todo = await Todo.findByPk(id);
    return response.json(todo);
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
