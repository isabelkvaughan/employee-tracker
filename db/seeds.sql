INSERT INTO department (id, name) VALUES
(1, 'Sales'),
(2, 'Marketing'),
(3, 'Engineering');

INSERT INTO role (id, title, salary, department_id) VALUES
(1, 'Sales Manager', 80000, 1),
(2, 'Sales Representative', 50000, 1),
(3, 'Marketing Manager', 90000, 2),
(4, 'Marketing Coordinator', 60000, 2),
(5, 'Software Engineer', 100000, 3),
(6, 'QA Engineer', 80000, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES
(1, 'John', 'Doe', 1, null),
(2, 'Jane', 'Doe', 2, 1),
(3, 'Bob', 'Smith', 3, null),
(4, 'Alice', 'Johnson', 4, 3),
(5, 'Mike', 'Williams', 5, null),
(6, 'Sara', 'Lee', 6, 5);
