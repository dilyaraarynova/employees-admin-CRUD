import { query } from "../utils/connectToDB.js";
import {
  createEmployeeTableQuery,
  getAllEmployeeQuery,
  createEmployeeQuery,
  getEmployeeQuery,
  deleteEmployeeQuery,
  updateEmployeeQuery,
} from "../utils/sqlQuery.js";
import { createError } from "../utils/error.js";

export async function getAllEmployee(req, res, next) {
  try {
    const response = await query(`
      SELECT to_regclass('employee_details');
      `);
    console.log(response);
    if (!response.rows[0].to_regclass) {
      await query(createEmployeeTableQuery);
    }
    const { rows } = await query(getAllEmployeeQuery);
    res.status(200).json(rows);
  } catch (error) {
    console.log(error.message);
    return next(createError(400, "Couldn.t get employee details!"));
  }
}
export async function createEmployee(req, res, next) {
  try {
    const { name, salary, age, email } = req.body;
    if (!name || !salary || !age || !email) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const data = await query(createEmployeeQuery, [name, email, age, salary]);
    res.status(201).json(data.rows[0]);
  } catch (error) {
    console.log(error.message);
    return next(createError(400, error.message));
  }
}

export async function getEmployee(req, res, next) {
  const id = req.params.id;
  const data = await query(getEmployeeQuery, [id]);
  console.log(data);
  if (!data.rows.length) {
    return next(createError(400, "Employee not found!"));
  }
  res.status(200).json(data.rows[0]);
}

export async function deleteEmployee(req, res, next) {
  const id = req.params.id;
  const data = await query(deleteEmployeeQuery, [id]);
  console.log(data);
  // if rowCount = 1 in the result, employee was found and deleted. if 0, employee was not found
  if (!data.rowCount) {
    return next(createError(400, "Employee not found!"));
  }
  res.status(200).json({ message: "Deleted succesfully!" });
}

export async function updateEmployee(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, age, salary } = req.body;
    const result = await query(updateEmployeeQuery, [
      name,
      email,
      age,
      salary,
      id,
    ]);
    // rowCount = 0 means no employee found and thus was not updated
    if (result.rowCount == 0) {
      return res.status(400).json({ error: "Employee not found." });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
