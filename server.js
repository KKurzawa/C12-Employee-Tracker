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
            } else if (response.menuChoices === 'Update An Employee Role') {
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
    console.log("***********************************")
    , console.log("*                                 *")
    , console.log("*        EMPLOYEE MANAGER         *")
    , console.log("*                                 *")
    , console.log("***********************************")

);

startTracker()

function exit() {
    console.log('Thank you for using the Employee Tracker!');
    process.exit()
};

function getDepartments() {
    const sql = `SELECT * FROM departments`;
    return db.promise().query(sql)
        .then((result) => {
            return result[0];
        })
};

function sendDepartments() {
    return getDepartments()
        .then((result) => {
            printTable(result);
        })
}

function getRoles() {
    const sql = `SELECT roles.id AS ID, roles.title AS Role, departments.departments_name AS Department, roles.salary AS Salary FROM roles LEFT JOIN departments ON roles.department_id=departments.id;`
    return db.promise().query(sql)
        .then((result) => {
            return result[0];
        })
};

function getEmployees() {
    return db.promise().query('SELECT employee.id AS ID, CONCAT(employee.first_name, " " , employee.last_name) AS Name, roles.title AS Role, departments.departments_name AS Department, roles.salary AS Salary, CONCAT(manager.first_name, " " , manager.last_name) AS Manager FROM employee LEFT JOIN roles ON employee.manager_id=roles.id LEFT JOIN employee manager ON manager.id=employee.manager_id LEFT JOIN departments ON roles.department_id=departments.id;')
        .then((result) => {
            return result[0];
        })
}

function getRolesAgain() {
    const sql = `SELECT * FROM roles`;
    return db.promise().query(sql)
        .then((result) => {
            return result[0];
        })
};

function sendRoles() {
    return getRoles()
        .then((result) => {
            printTable(result);
        })
}



function getEmployeesAgain() {
    return db.promise().query('SELECT * FROM employee')
        .then((result) => {
            return result[0];
        })
}

function sendEmployees() {
    return getEmployees()
        .then((result) => {
            printTable(result);
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
    return getRolesAgain()
        .then((databaseRoles) => {
            const roles = databaseRoles.map((role) => {
                return { value: role.id, name: role.title }
            })
            return getEmployeesAgain()
                .then((databaseEmployees) => {
                    const employees = databaseEmployees.map((employee) => {
                        const name = employee.first_name + " " + employee.last_name
                        return { value: employee.id, name: name }
                    })
                    employees.push({
                        value: null, name: 'none'
                    })
                    return inquirer
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
                                choices: employees,
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
                })
        })
};

function updateRole() {
    return getEmployeesAgain()
        .then((databaseEmployees) => {
            const employees = databaseEmployees.map((employee) => {
                const name = employee.first_name + " " + employee.last_name
                return { value: employee.id, name: name }
            })
            return getRolesAgain()
                .then((databaseRoles) => {
                    const roles = databaseRoles.map((role) => {
                        return { value: role.id, name: role.title }
                    })
                    return inquirer
                        .prompt([
                            {
                                type: 'list',
                                message: 'Which employees role would you like to update?',
                                choices: employees,
                                name: 'reasignedEmployee',
                            },
                            {
                                type: 'list',
                                message: 'Which role do you want to assign the listed employee?',
                                choices: roles,
                                name: 'reasignedRole',
                            },
                        ])
                        .then((result) => {
                            return sendEmployees();
                        })
                        .then((result) => {
                            startTracker();
                        })

                })
        })
};



