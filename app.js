const connection = require("./config/connection");

connection.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
});
