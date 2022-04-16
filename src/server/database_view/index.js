const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');
 
// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'tipton',
  password: 'root',
  database: 'metadata'
});
connection.connect(function(err)
{
    if (err)
    throw err;
    viewData();

})

function readDB(){
    connection.query(
        'SELECT * FROM data', function(err,results,fields){
            console.table(results);
            console.table(fields);
        }
    ); 
}


function viewData(){
    inquirer.prompt([
        {
            type: 'list',
            name: 'mainMenu',
            message: 'What would you like to do?',
            choices: ['View all data','Lookup data by name', 'Lookup data by value']
        }
    ]).then(answers => {
        switch(answers.choices){
            case 'View all data':
                readDB();
                viewData();
                break;
        }
    })
}