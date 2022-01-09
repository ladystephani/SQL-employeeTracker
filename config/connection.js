const mysql = require("mysql2");
//require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "secretsecret",
    database: "employee_tracker_db",
  },
  console.log("connected to db")
  //   {
  //     host: "localhost",
  //     user: process.env.DB_USER,
  //     password: process.env.DB_PW,
  //     database: process.env.DB_NAME,
  //   },
  //   console.log("connected to db")
);

module.exports = db;
