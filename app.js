const db = require("./config/connection");
const cTable = require("console.table");
const inquirer = require("inquirer");

db.connect((err) => {
  if (err) throw err;
  userPrompt();
});

const userPrompt = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do today?",
        name: "menu",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add department",
          "Add role",
          "Add employee",
          "Update employee's role",
          "End",
        ],
      },
    ])
    .then((val) => {
      switch (val.menu) {
        case "View all departments":
          viewAllDpts();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add department":
          addDpt();
          break;
        case "Add role":
          addRole();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "Update employee's role":
          updateEmployee();
          break;
        case "End":
          db.end();
          break;
      }
    });
};
