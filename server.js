const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'employees_db'
    },
    console.log(`Welcome to the Employee Tracker!`)
);

function exit() {
    console.log('Thank you for using the Employee Tracker!');
    process.exit()
};

function getDepartments() {
    return db.promise().query('SELECT * FROM departments');
};

function getRoles() {
    return db.promise().query('SELECT * FROM roles');
};

function getEmployees() {
    return db.promise().query('SELECT * FROM employee');
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter A Department.',
                name: 'department',
            },
        ])
        .then((result) => {
            return db.promise().query('INSERT INTO departments (departments_name) values (?)', result.department);
        })
        .then(result => {
            console.log(result);
        })
};

function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter Title of Role.',
                name: 'roleName',
            },
            {
                type: 'input',
                message: 'Enter Salary of Role.',
                name: 'roleSalary',
            },
            {
                type: 'input',
                message: 'Enter Department Role Will Be in.',
                name: 'roleDepartment',
            },
        ])
        .then((input) => {
            return db.promise().query('INSERT INTO roles (title, salary, department_id) values (?, ?, ?)', input.title, input.salary, input.department_id);
        })

};

function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter First Name of Employee.',
                name: 'firstName',
            },
            {
                type: 'input',
                message: 'Enter Last Name of Employee.',
                name: 'lastName',
            },
            {
                type: 'input',
                message: 'Enter Role of Employee',
                name: 'employeeRole',
            },
            {
                type: 'input',
                message: 'Enter Manager of Employee',
                name: 'employeeManager',
            },
        ])
        .then((input) => {
            return db.promise().query('INSERT INTO employee (id, first_name, last_name, role_id, manager_id) values (1, "first", "last", 1, 1)');
        })

};



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
        } else if (response.menuChoices === 'View All Departments') {
            getDepartments();
        } else if (response.menuChoices === 'View All Roles') {
            getRoles();
        } else if (response.menuChoices === 'View All Employees') {
            getEmployees();
        } else if (response.menuChoices === 'Add A Department') {
            addDepartment();
        } else if (response.menuChoices === 'Add A Role') {
            addRole();
        } else if (response.menuChoices === 'Add An Employee') {
            addEmployee();
        }
    });

