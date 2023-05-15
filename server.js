const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const fs = require('fs');

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

// define the questions to prompt the user
const questions = [
    {
      type: 'list',
      name: 'query',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'Add Employee',
        'Update Employee Role',
        'View All Roles',
        'Add Role',
        'View All Departments',
        'Add Department'
    ],
    prefix: '(Use arrow keys to select)',
    suffix: '(Move up and down to reveal more)'
    }
  ];