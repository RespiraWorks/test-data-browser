const inquirer = require('inquirer');
const mysql = require('mysql2');

// const fs = require('fs');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'tipton',
  password: 'root',
  database: 'metadata'
});

function readDB() {
  connection.query('SELECT * FROM data', (err, results, fields) => {
    console.table(results);
    console.table(fields);
  });
}

function viewData(){
  inquirer.prompt([
    {
      type: 'list',
      name: 'mainMenu',
      message: 'What would you like to do?',
      choices: ['View all data','Lookup data by name', 'Lookup data by value']
    }
  ]).then((answers) => {
    switch (answers.choices) {
      case 'View all data':
        readDB();
        viewData();
        break;
    }
  });
}

connection.connect((err) => {
  if (err) { throw err; }
  viewData();
});
