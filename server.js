const inquirer = require('inquirer');
const mysql = require('mysql2');
function startTracker() {
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
                startTracker();
            } else if (response.menuChoices === 'View All Roles') {
                getRoles();
                startTracker();
            } else if (response.menuChoices === 'View All Employees') {
                getEmployees();
                startTracker();
            } else if (response.menuChoices === 'Add A Department') {
                addDepartment();
            } else if (response.menuChoices === 'Add A Role') {
                addRole();
            } else if (response.menuChoices === 'Add An Employee') {
                addEmployee();
            }
        });
};
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'employees_db'
    },
    console.log(`Welcome to the Employee Tracker!`)

);

startTracker()

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
        .then((result) => {
            return db.promise().query('SELECT * FROM departments');
        })
        .then((result) => {
            startTracker();
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
                type: 'list',
                message: 'Which department does the role belong to?',
                choices: [
                    { name: 'Sales', value: 'Sales' },
                    { name: 'Customer Service', value: 'Customer Service' },
                ],
                name: 'departmentChoice',
            },
        ])
        .then((result) => {
            console.log(result.roleName);
            return db.promise().query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', result.roleName, result.roleSalary, result.departmentChoice);
        })
        .then((result) => {
            return db.promise().query('SELECT * FROM roles');
        })
        .then((result) => {
            startTracker();
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
                type: 'list',
                message: 'What is the employees role?',
                choices: [
                    { name: 'Sales', value: 'Sales' },
                    { name: 'Customer Service', value: 'Customer Service' },
                ],
                name: 'employeeRole',
            },
            {
                type: 'list',
                message: 'Who is the employees manager?',
                choices: [
                    { name: 'John Smith', value: 'John Smith' },
                    { name: 'Joe Dart', value: 'Joe Dart' },
                ],
                name: 'employeeManager',
            },
        ])
        .then((result) => {
            return db.promise().query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', result.firstName, result.lastName, result.employeeRole, result.employeeManager);
        })
        .then((result) => {
            return db.promise().query('SELECT * FROM roles');
        })
        .then((result) => {
            startTracker();
        })
};


// function startTracker() {
//     inquirer
//         .prompt([
//             {
//                 type: 'list',
//                 message: 'What would you like to do?',
//                 choices: [
//                     { name: 'View All Departments', value: 'View All Departments' },
//                     { name: 'View All Roles', value: 'View All Roles' },
//                     { name: 'View All Employees', value: 'View All Employees' },
//                     { name: 'Add A Department', value: 'Add A Department' },
//                     { name: 'Add A Role', value: 'Add A Role' },
//                     { name: 'Add An Employee', value: 'Add An Employee' },
//                     { name: 'Update An Employee Role', value: 'Update An Employee Role' },
//                     { name: 'Exit', value: 'Exit' },
//                 ],
//                 name: 'menuChoices',
//             },
//         ])
//         .then((response) => {
//             console.log(response.menuChoices);
//             if (response.menuChoices === 'Exit') {
//                 exit();
//             } else if (response.menuChoices === 'View All Departments') {
//                 getDepartments();
//             } else if (response.menuChoices === 'View All Roles') {
//                 getRoles();
//             } else if (response.menuChoices === 'View All Employees') {
//                 getEmployees();
//             } else if (response.menuChoices === 'Add A Department') {
//                 addDepartment();
//             } else if (response.menuChoices === 'Add A Role') {
//                 addRole();
//             } else if (response.menuChoices === 'Add An Employee') {
//                 addEmployee();
//             }
//         });
// };

