/* eslint-disable no-undef */

const todoList = require("../todo");

const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("Todolist Test Suite", () => {
  beforeAll(() => {
    add({
      title: "new todo",
      completed: false,
      dueDate: new Date().toISOString().split("T")[0],
    });
  });

  test("Should add new todo", () => {
    const todoItemsCount = all.length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().split("T")[0],
    });
    expect(all.length).toBe(todoItemsCount + 1);
  });

  test("Should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("Should retrieve overdue items", () => {
    add({
      title: "Overdue Test todo",
      completed: false,
      dueDate: "2023-05-02",
    });
    const overdueitems = overdue();
    expect(overdueitems.length).toBe(1);
    expect(overdueitems[0].title).toBe("Overdue Test todo");
  });

  test("Should retrieve due today items", () => {
    const todayItems = dueToday();
    expect(todayItems.length).toBeGreaterThan(0);
    expect(todayItems[0].dueDate).toBe(new Date().toISOString().split("T")[0]);
  });

  test("Should retrieve due later items", () => {
    add({
      title: "Due later test todo",
      completed: false,
      dueDate: "2100-01-01",
    });
    const dueLaterItems = dueLater();
    expect(dueLaterItems.length).toBe(1);
    expect(dueLaterItems[0].title).toBe("Due later test todo");
  });
});
