/* eslint-disable no-unused-vars */
// __tests__/todo.js
/* eslint-disable no-undef */

const db = require("../models");

const getJSDate = (days) => {
  if (!Number.isInteger(days)) {
    throw new Error("Need to pass an integer as days");
  }
  const today = new Date();
  const oneDay = 60 * 60 * 24 * 1000;
  return new Date(today.getTime() + days * oneDay);
};

describe("TodoList Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });
  test("Test for overdue", async () => {
    const todotest = await db.Todo.overdue();
    const todo = await db.Todo.addTask({
      title: "Overdue testing",
      dueDate: getJSDate(-4),
      completed: false,
    });
    const item = await db.Todo.overdue();
    expect(item.length).toBe(todotest.length + 1);
  });
  test("Test for today", async () => {
    const todotest = await db.Todo.dueToday();
    const todo = await db.Todo.addTask({
      title: "Overdue testing",
      dueDate: getJSDate(0),
      completed: false,
    });
    const item = await db.Todo.dueToday();
    expect(item.length).toBe(todotest.length + 1);
  });
  test("Test for Later", async () => {
    const todotest = await db.Todo.dueLater();
    const todo = await db.Todo.addTask({
      title: "Overdue testing",
      dueDate: getJSDate(5),
      completed: false,
    });
    const item = await db.Todo.dueLater();
    expect(item.length).toBe(todotest.length + 1);
  });
});

// describe("Todolist Test Suite", () => {
//   beforeAll(async () => {
//     await db.sequelize.sync({ force: true });
//   });

//   test("Should add new todo", async () => {
//     const todoItemsCount = await db.Todo.count();
//     await db.Todo.addTask({
//       title: "Test todo",
//       completed: false,
//       dueDate: new Date(),
//     });
//     const newTodoItemsCount = await db.Todo.count();
//     expect(newTodoItemsCount).toBe(todoItemsCount + 1);
//   });
// });

/* eslint-disable no-undef */

// const todoList = require("../todo");

// const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

// describe("Todolist Test Suite", () => {
//   beforeAll(() => {
//     add({
//       title: "new todo",
//       completed: false,
//       dueDate: new Date().toISOString().split("T")[0],
//     });
//   });

//   test("Should add new todo", () => {
//     const todoItemsCount = all.length;
//     add({
//       title: "Test todo",
//       completed: false,
//       dueDate: new Date().toISOString().split("T")[0],
//     });
//     expect(all.length).toBe(todoItemsCount + 1);
//   });

//   test("Should mark a todo as complete", () => {
//     expect(all[0].completed).toBe(false);
//     markAsComplete(0);
//     expect(all[0].completed).toBe(true);
//   });

//   test("Should retrieve overdue items", () => {
//     add({
//       title: "Overdue Test todo",
//       completed: false,
//       dueDate: "2023-05-02",
//     });
//     const overdueitems = overdue();
//     expect(overdueitems.length).toBe(1);
//     expect(overdueitems[0].title).toBe("Overdue Test todo");
//   });

//   test("Should retrieve due today items", () => {
//     const todayItems = dueToday();
//     expect(todayItems.length).toBeGreaterThan(0);
//     expect(todayItems[0].dueDate).toBe(new Date().toISOString().split("T")[0]);
//   });

//   test("Should retrieve due later items", () => {
//     add({
//       title: "Due later test todo",
//       completed: false,
//       dueDate: "2100-01-01",
//     });
//     const dueLaterItems = dueLater();
//     expect(dueLaterItems.length).toBe(1);
//     expect(dueLaterItems[0].title).toBe("Due later test todo");
//   });
// });
