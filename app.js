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

/** Add */
const addDpt = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the department name",
        name: "dptName",
      },
    ])
    .then((data) => {
      const sql = `INSERT INTO department (name) 
      VALUES (?)`;
      const params = [data.dptName];

      db.query(sql, params, (err) => {
        if (err) throw err;

        //console.table(data);
        console.log(`Added department to database`);
        userPrompt();
      });
    });
};

let dptArr = [];
const selectDpt = () => {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      dptArr.push(res[i].name);
    }
  });
  return dptArr;
};
const addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the title",
        name: "title",
      },
      {
        type: "input",
        message: "Enter the salary",
        name: "salary",
      },
      {
        type: "list",
        message: "Select the department",
        name: "dptSelection",
        choices: selectDpt(),
      },
    ])
    .then((data) => {
      //   console.log(data);
      //{
      //   title: 'Marketing Head',
      //   salary: '100000',
      //   dptSelection: 'Marketing'
      // }
      const dptId = selectDpt().indexOf(data.dptSelection) + 1;

      const sql = `INSERT INTO roleType (title, salary, department_id) 
      VALUES (?,?,?)`;
      const params = [data.title, data.salary, dptId];

      //const table = cTable.getTable(data);

      db.query(sql, params, (err) => {
        if (err) throw err;
        //console.log(table);
        console.log(`Added role to database`);
        userPrompt();
      });
    });
};

/** Add employee && Update employee role */

//helper functions

//Note:selectRole() can generate array outside
let roleArr = [];
const selectRole = () => {
  const sql = `SELECT * FROM roleType`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }
  });
  return roleArr;
};

let managerFirstNameArr = [];
const addEmployee = () => {
  const sql = `SELECT first_name, last_name FROM employee WHERE manager_id IS NULL`;

  db.query(sql, (err, res) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "input",
          message: "Enter the first name",
          name: "first_name",
        },
        {
          type: "input",
          message: "Enter the last name",
          name: "last_name",
        },
        {
          type: "list",
          message: "Select the role",
          name: "roleSelection",
          choices: selectRole(),
        },
        {
          type: "list",
          message: "Select the employee's manager",
          name: "managerSelection",
          // selecting Manager and selecting Employees work inside db.query in this case
          choices: function () {
            for (let i = 0; i < res.length; i++) {
              managerFirstNameArr.push(res[i].first_name);
            }
            return managerFirstNameArr;
          },
        },
      ])
      .then((data) => {
        const roleId = selectRole().indexOf(data.roleSelection) + 1;
        db.query(`SELECT * FROM employee`, (err, res) => {
          let employeeArr = [];
          for (let i = 0; i < res.length; i++) {
            employeeArr.push(res[i].first_name);
          }
          const managerId = employeeArr.indexOf(data.managerSelection) + 1;

          const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
             VALUES (?,?,?,?)`;
          const params = [data.first_name, data.last_name, roleId, managerId];

          db.query(sql, params, (err) => {
            if (err) throw err;
            console.log("Added Employee to database");
            userPrompt();
          });
        });
      });
  });
};

let employelastNameArr = [];

const updateEmployee = () => {
  const sql = `SELECT employee.last_name, roleType.title 
    FROM employee 
    LEFT JOIN roleType 
    ON employee.role_id = roleType.id`;

  db.query(sql, (err, res) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "list",
          message: "Select the last name",
          name: "lastName",
          //selecting employee inside db.query works...
          choices: function () {
            for (let i = 0; i < res.length; i++) {
              employelastNameArr.push(res[i].last_name);
            }
            return employelastNameArr;
          },
        },
        {
          type: "list",
          message: "Select the new role",
          name: "roleSelection",
          choices: selectRole(),
        },
      ])
      .then((data) => {
        const roleId = selectRole().indexOf(data.roleSelection) + 1;
        const sql = `UPDATE employee SET role_id = ? 
            WHERE last_name = ?`;
        const params = [roleId, data.lastName];

        db.query(sql, params, (err) => {
          if (err) throw err;
          console.log("Updated Employee's role in database");
          userPrompt();
        });
      });
  });
};
