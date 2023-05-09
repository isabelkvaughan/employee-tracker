const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const fs = require('fs');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'Lollipop1!',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

  // source the schema.sql and seeds.sql files
const schemaSql = fs.readFileSync('schema.sql', 'utf8');
connection.query(schemaSql, (err) => {
  if (err) throw err;
  console.log('schema.sql file executed successfully!');
});

const seedsSql = fs.readFileSync('seeds.sql', 'utf8');
connection.query(seedsSql, (err) => {
  if (err) throw err;
  console.log('seeds.sql file executed successfully!');
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
    ]
    prefix: '(Use arrow keys to select)'
    suffix: '(Move up and down to reveal more)'
    }
  ];