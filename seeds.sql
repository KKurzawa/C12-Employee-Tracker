INSERT INTO departments (id, departments_name, active)
VALUES (001, "Sales", true),
       (002, "IT", true),
       (003, "Management", true);

INSERT INTO roles (id, title, salary, active)
VALUES (001, "Sales", 50,000, true),
       (002, "Manager", 100,000, true),
       (003, "Developer", 75,000, true);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id, active)
VALUES (001, "John", "Smith", 1, 1, true),
       (002, "Joe", "Jackson", 2, 2, true),
       (003, "Adam", "Jones", 3, 3, true);