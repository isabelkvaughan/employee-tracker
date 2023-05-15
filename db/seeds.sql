INSERT INTO departments (name) VALUES
('Sales'),
('Marketing'),
('Engineering');

INSERT INTO roles (title, salary, department_id) VALUES
('Sales Manager', 80000, 1),
('Sales Representative', 50000, 1),
('Marketing Manager', 90000, 2),
('Marketing Coordinator', 60000, 2),
('Software Engineer', 100000, 3),
('QA Engineer', 80000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, null),
('Jane', 'Doe', 2, 1),
('Bob', 'Smith', 3, null),
('Alice', 'Johnson', 4, 3),
('Mike', 'Williams', 5, null),
('Sara', 'Lee', 6, 5);
