DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE Department (
  id INT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE Role (
  id INT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL
);

CREATE TABLE Employee (
  id INT PRIMARY KEY, 
  first_name VARCHAR(30) NOT NULL, 
  last_name VARCHAR(30) NOT NULL, 
  role_id INT NOT NULL,
  manager_id INT
);