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