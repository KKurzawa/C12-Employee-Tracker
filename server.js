const inquirer = require('inquirer');
const mysql = require('mysql2');

function exit() {
    process.exit()
};

inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                { name: 'View all employees', value: 'View all employees' },
                { name: 'Add employee', value: 'Add employee' },
                { name: 'View all roles', value: 'View all roles' },
                { name: 'Exit', value: 'Exit' },
            ],
            name: 'menuChoices',
        },
    ])
    .then((response) => {
        console.log(response.menuChoices);
        if (response.menuChoices === 'Exit') {
            exit();
        }

    });