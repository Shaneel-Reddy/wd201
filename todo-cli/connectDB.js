const Sequelize = require("sequelize");
require("dotenv").config();

const database = "todo_db";
const username = "postgres";
// eslint-disable-next-line no-undef
const password = process.env.DATABASE_PASSWORD;
const sequelize = new Sequelize(database, username, password, {
  host: "localhost",
  dialect: "postgres",
});

const connect = async () => {
  return sequelize.authenticate();
};

module.exports = {
  connect,
  sequelize,
};
