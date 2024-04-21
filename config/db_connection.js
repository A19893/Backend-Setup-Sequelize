const { Sequelize } = require("sequelize");
const event_emitter = require("events");
const db_event_emitter = new event_emitter();

if (!process.env.NODE_ENV) {
    console.log("NODE_ENV is not defined.");
    process.exit(128);
}

const config = require("./config")[process.env.NODE_ENV];
const sequelize = new Sequelize(config);

const check_connection = async () => {
  try {
    const connection_string = `${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.POSTGRES_DB}`
    console.log("Database connection url",connection_string);
    await sequelize.authenticate();
    console.log("Database connection has been established successfully");
    db_event_emitter.emit("connection");
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

check_connection();

module.exports = {
  sequelize,
  check_connection
};
