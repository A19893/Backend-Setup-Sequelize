require("dotenv").config();
global.argv = process.argv.slice(2);
global.port = global.argv[0] || process.env.APP_PORT;
if (!global.port) {
  console.log("port is not defined. argv = ", global.argv);
  process.exit(128);
}

const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.use(require("./routes"));

process.on("uncaughtException", (err) => {
  console.log("uncaught exception", err);
});

app.listen(global.port, () => {
  const NODE_ENV= process.env.NODE_ENV;
  console.log(`${NODE_ENV} Server is listening on port ${global.port}`);
});


module.exports = app;