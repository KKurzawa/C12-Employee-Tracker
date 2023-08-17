const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

function exit() {
    process.exit()
};

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter A Department.',
                name: 'department',
            },
        ])
        .then((input) => {
            db.query('INSERT INTO Department (id, name)', function (err, results) {
                console.log(input.department);
            });
        })

}

inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                { name: 'View All Departments', value: 'View All Departments' },
                { name: 'View All Roles', value: 'View All Roles' },
                { name: 'View All Employees', value: 'View All Employees' },
                { name: 'Add A Department', value: 'Add A Department' },
                { name: 'Add A Role', value: 'Add A Role' },
                { name: 'Add An Employee', value: 'Add An Employee' },
                { name: 'Update An Employee Role', value: 'Update An Employee Role' },
                { name: 'Exit', value: 'Exit' },
            ],
            name: 'menuChoices',
        },
    ])
    .then((response) => {
        console.log(response.menuChoices);
        if (response.menuChoices === 'Exit') {
            exit();
            console.log('Thank you for using the Employee Tracker!');
        } else if (response.menuChoices === 'View All Departments') {
            db.query('SELECT * FROM Department', function (err, results) {
                console.log(results);
            });
        } else if (response.menuChoices === 'View All Roles') {
            db.query('SELECT * FROM Role', function (err, results) {
                console.log(results);
            });
        } else if (response.menuChoices === 'View All Employees') {
            db.query('SELECT * FROM Employee', function (err, results) {
                console.log(results);
            });
        } else if (response.menuChoices === 'Add A Department') {
            addDepartment()
        }
    });

