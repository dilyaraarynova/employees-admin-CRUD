export const createEmployeeTableQuery = `
  CREATE TABLE employee_details(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    age SMALLINT NOT NULL CHECK (age > 17),
    salary DECIMAL(8,2) NOT NULL
  );
`;

export const getAllEmployeeQuery = `
  SELECT * FROM employee_details
`;

export const createEmployeeQuery = `
  INSERT INTO employee_details(name, email, age, salary)
  VALUES($1,$2,$3,$4) RETURNING *
`;

export const getEmployeeQuery = `
  SELECT * FROM employee_details WHERE id = $1
`;

export const deleteEmployeeQuery = `
  DELETE FROM employee_details WHERE id = $1
`;

// COALESCE function will check if we passed an argumentfor the corresponding field, if not, it will use the prev value
export const updateEmployeeQuery = `
  UPDATE employee_details 
  SET
  name = COALESCE($1,name),
  email = COALESCE($2,email),
  age = COALESCE($3,age),
  salary = COALESCE($4, salary)
  WHERE id = $5
  RETURNING *
`;
