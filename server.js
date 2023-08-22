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
                sendDepartments()
                    .then(() => {
                        startTracker();
                    })

            } else if (response.menuChoices === 'View All Roles') {
                sendRoles()
                    .then(() => {
                        startTracker();
                    })
            } else if (response.menuChoices === 'View All Employees') {
                sendEmployees()
                    .then(() => {
                        startTracker();
                    })
            } else if (response.menuChoices === 'Add A Department') {
                addDepartment();
            } else if (response.menuChoices === 'Add A Role') {
                addRole();
            } else if (response.menuChoices === 'Add An Employee') {
                addEmployee();
            } else if (response.menuChoices === 'Update Employee Role') {
                updateRole();
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
    return db.promise().query('SELECT * FROM departments')
        .then((result) => {
            return result[0];
        })
};

function sendDepartments() {
    return getDepartments()
        .then((result) => {
            printTable(result[0]);
        })
}

function getRoles() {
    return db.promise().query('SELECT * FROM roles');
};

function sendRoles() {
    return getRoles()
        .then((result) => {
            printTable(result[0]);
        })
}

function getEmployees() {
    return db.promise().query('SELECT * FROM employee');
}

function sendEmployees() {
    return getEmployees()
        .then((result) => {
            printTable(result[0]);
        })
}

function printTable(data) {
    console.table(data);
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
            console.log(result);
            return db.promise().query('INSERT INTO departments (departments_name) values (?)', result.department);
        })
        .then((result) => {
            return sendDepartments();
        })
        .then((result) => {
            startTracker();
        })
};

function addRole() {
    return getDepartments()
        .then((databaseDepartments) => {
            const departments = databaseDepartments.map((department) => {
                return { value: department.id, name: department.departments_name }
            })
            return inquirer
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
                        choices: departments,
                        name: 'departmentChoice',
                    },
                ])
                .then((result) => {
                    console.log(result);
                    return db.promise().query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [result.roleName, result.roleSalary, result.departmentChoice]);
                })
                .then((result) => {
                    return sendRoles();
                })
                .then((result) => {
                    startTracker();
                })
        })


};

function addEmployee() {
    const roles = [
        { name: 'Manager', value: 1 },
        { name: 'Technician', value: 2 },
    ];
    const manager = [
        { name: 'John Smith', value: 1 },
        { name: 'Joe Dart', value: 2 },
    ];
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
                choices: roles,
                name: 'employeeRole',
            },
            {
                type: 'list',
                message: 'Who is the employees manager?',
                choices: manager,
                name: 'employeeManager',
            },
        ])
        .then((result) => {
            return db.promise().query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [result.firstName, result.lastName, result.employeeRole, result.employeeManager]);
        })
        .then((result) => {
            return sendEmployees();
        })
        .then((result) => {
            startTracker();
        })
};

function updateRole() {
    const employee = [
        { name: 'Anne Frank' },
        { name: 'Marc Maron' },
    ];
    const newRole = [
        { name: 'Manger' },
        { name: 'Minion' },
    ];
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Which employees role would you like to update?',
                choices: employee,
                name: 'reasignedEmployee',
            },
            {
                type: 'list',
                message: 'Which role do you want to assign the listed employee?',
                choices: newRole,
                name: 'reasignedRole',
            },
        ])
}



