const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const fs = require('fs');
const inquirer = require('inquirer');

// Connect to database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Lollipop1!',
  database: 'employees_db'
}, (err) => {
  if (err) throw err;
  console.log(`Connected to database.`);
});

// Define the questions to prompt the user
const questions = [
  {
    type: 'list',
    name: 'option',
    message: 'What would you like to do?',
    choices: [
      'View All Employees',
      'Add Employee',
      'Update Employee Role',
      'View All Roles',
      'Add Role',
      'View All Departments',
      'Add Department',
      'Exit'
    ]
  }
];

// Prompt the user with the available options
function promptUser() {
  inquirer.prompt(questions)
  .then(answer => {
    switch(answer.option) {
      case 'View All Employees':
        viewEmployees();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      case 'View All Roles':
        viewRoles();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'View All Departments':
        viewDepartments();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Exit':
        db.end();
        break;
      default:
        console.log(`Invalid option: ${answer.option}`);
        promptUser();
    }
  })
  .catch(error => {
    console.log(`Error: ${error.message}`);
    db.end();
  });
}

// Functions to handle each option

function viewEmployees() {
  db.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title AS job_title, departments.name AS department, roles.salary, CONCAT(managers.first_name, ' ', managers.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees managers ON employees.manager_id = managers.id`, (error, results) => {
    if (error) {
      console.log(`Error: ${error.message}`);
      return promptUser();
    }
    console.table(results);
    promptUser();
  });
}

function addEmployee() {
  // Get the list of available roles from the database
  db.query(`SELECT roles.id, roles.title FROM roles`, (error, results) => {
    if (error) {
      console.log(`Error: ${error.message}`);
      return promptUser();
    }
    
    // Create a list of role choices for the user to select from
    const roleChoices = results.map(role => ({
      name: role.title,
      value: role.id
    }));
    
    // Get the list of available managers from the database
    db.query(`SELECT employees.id, CONCAT(first_name, ' ', last_name) AS name FROM employees LEFT JOIN roles ON employees.role_id = roles.id WHERE roles.title LIKE '%manager%' OR employees.manager_id IS NULL`, (error, results) => {
      if (error) {
        console.log(`Error: ${error.message}`);
        return promptUser();
      }
    
      // Create a list of manager choices for the user to select from, including a null option
      const managerChoices = [
        { name: 'None', value: null },
        ...results.map(manager => ({
          name: manager.name,
          value: manager.id
        }))
      ];
      
      // Prompt the user for the required information
      inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: 'Enter the first name of the new employee:'
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'Enter the last name of the new employee:'
        },
        {
          type: 'list',
          name: 'roleId',
          message: 'Select the role of the new employee:',
          choices: roleChoices
        },
        {
          type: 'list',
          name: 'managerId',
          message: 'Select the manager of the new employee:',
          choices: managerChoices
        }
      ])
      .then(answer => {
        const firstName = answer.firstName;
        const lastName = answer.lastName;
        const roleId = answer.roleId;
        const managerId = answer.managerId;
        
        // Add the new employee to the database
        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        db.query(sql, [firstName, lastName, roleId, managerId], (error, result) => {
          if (error) {
            console.log(`Error: ${error.message}`);
            return promptUser();
          }
          console.log(`Employee added successfully!`);
          promptUser();
        });
      })
      .catch(error => {
        console.log(`Error: ${error.message}`);
        db.end();
      });
    });
  });
}

function updateEmployeeRole() {
  // Get the list of available employees from the database
  db.query(`SELECT employees.id, CONCAT(employees.first_name, ' ', employees.last_name) AS name FROM employees`, (error, results) => {
    if (error) {
      console.log(`Error: ${error.message}`);
      return promptUser();
    }

    // Create a list of employee choices for the user to select from
    const employeeChoices = results.map(employee => ({
      name: employee.name,
      value: employee.id
    }));

    // Get the list of available roles from the database
    db.query(`SELECT roles.id, roles.title FROM roles`, (error, results) => {
      if (error) {
        console.log(`Error: ${error.message}`);
        return promptUser();
      }

      // Create a list of role choices for the user to select from
      const roleChoices = results.map(role => ({
        name: role.title,
        value: role.id
      }));

      // Prompt the user to select an employee and a new role
      inquirer.prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select the employee whose role you want to update:',
          choices: employeeChoices
        },
        {
          type: 'list',
          name: 'roleId',
          message: 'Select the new role for the employee:',
          choices: roleChoices
        }
      ])
      .then(answer => {
        const employeeId = answer.employeeId;
        const roleId = answer.roleId;

        // Update the employee's record in the database with the new role
        const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
        db.query(sql, [roleId, employeeId], (error, result) => {
          if (error) {
            console.log(`Error: ${error.message}`);
            return promptUser();
          }
          console.log(`Employee role updated successfully!`);
          promptUser();
        });
      })
      .catch(error => {
        console.log(`Error: ${error.message}`);
        db.end();
      });
    });
  });
}


function viewRoles() {
  db.query(`SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles LEFT JOIN departments ON roles.department_id = departments.id`, (error, results) => {
    if (error) {
      console.log(`Error: ${error.message}`);
      return promptUser();
    }
    console.table(results);
    promptUser();
  });
}

function addRole() {
  db.query(`SELECT departments.id, departments.name FROM departments`, (error, results) => {
    if (error) {
      console.log(`Error: ${error.message}`);
      return promptUser();
    }
    
    const departmentChoices = results.map(department => ({
      name: department.name,
      value: department.id
    }));

    inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the new role:'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for the new role (numbers only):',
        validate: function(input) {
          const isNumber = /^\d+$/.test(input);
          if (isNumber) {
            return true;
          } else {
            return 'Please enter a valid number';
          }
        }
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'Select the department for the new role:',
        choices: departmentChoices
      }
    ])
    .then(answer => {
      const { name, salary, department_id } = answer;
      const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
      db.query(sql, [name, salary, department_id], (error, result) => {
        if (error) {
          console.log(`Error: ${error.message}`);
          return promptUser();
        }
        console.log(`Role added successfully!`);
        promptUser();
      });
    })
    .catch(error => {
      console.log(`Error: ${error.message}`);
      db.end();
    });
  });
}

function viewDepartments() {
  db.query(`SELECT * FROM departments`, (error, results) => {
    if (error) {
      console.log(`Error: ${error.message}`);
      return promptUser();
    }
    console.table(results);
    promptUser();
  });
}

function addDepartment() {
  inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'Enter the name of the new department:'
  })
  .then(answer => {
    const name = answer.name;
    const sql = `INSERT INTO departments (name) VALUES (?)`;
    db.query(sql, [name], (error, result) => {
      if (error) {
        console.log(`Error: ${error.message}`);
        return promptUser();
      }
      console.log(`Department added successfully!`);
      promptUser();
    });
  })
  .catch(error => {
    console.log(`Error: ${error.message}`);
    db.end();
  });
}

promptUser();