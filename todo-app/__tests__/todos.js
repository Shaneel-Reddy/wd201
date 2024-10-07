/* eslint-disable no-undef */
const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

describe("Todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });
  test("responds with json at /todos", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    expect(csrfToken).toBeDefined();
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });
  test("Mark todo as complete", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy coke",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const groupedtodosresponse = await agent
      .get("/")
      .set("Accept", "application/json");

    const parsedgroupedresponse = JSON.parse(groupedtodosresponse.text);
    console.log(parsedgroupedresponse);
    const dueTodaycount = parsedgroupedresponse.dueTodayTodos.length;
    const latestTodo = parsedgroupedresponse.dueTodayTodos[dueTodaycount - 1];

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);
    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        _csrf: csrfToken,
        completed: true,
      });
    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(!latestTodo.completed);
  });
  //   test("Delete a Todo", async () => {
  //     const response = await agent.post("/todos").send({
  //       title: "Buy Coffee",
  //       dueDate: new Date().toISOString(),
  //       completed: false,
  //     });
  //     const parsedResponse = JSON.parse(response.text);
  //     const todoID = parsedResponse.id;
  //     const deleteResponse = await agent.delete(`/todos/${todoID}`);
  //     const deleteResult = JSON.parse(deleteResponse.text);
  //     expect(deleteResponse.statusCode).toBe(200);
  //     expect(deleteResult).toBe(true);
  //     const fetchDeletedResponse = await agent.get(`/todos/${todoID}`);
  //     expect(fetchDeletedResponse.statusCode).toBe(404);
  //   });
});
