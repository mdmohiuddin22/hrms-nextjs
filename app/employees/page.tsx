"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Department = {
  id: number;
  name: string;
};

type Employee = {
  id: number;
  name: string;
  email: string;
  department: Department;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadEmployees() {
    const response = await fetch("/api/employees");
    const data = await response.json();
    setEmployees(data);
  }

  async function loadDepartments() {
    const response = await fetch("/api/departments");
    const data = await response.json();
    setDepartments(data);
  }

  useEffect(() => {
    loadEmployees();
    loadDepartments();
  }, []);

  function clearForm() {
    setName("");
    setEmail("");
    setDepartmentId("");
    setEditingId(null);
  }

  function startEdit(employee: Employee) {
    setEditingId(employee.id);
    setName(employee.name);
    setEmail(employee.email);
    setDepartmentId(employee.department.id);
  }

  async function saveEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!departmentId) {
      alert("Please select a department");
      return;
    }

    const method = editingId ? "PUT" : "POST";

    const body = editingId
      ? { id: editingId, name, email, departmentId }
      : { name, email, departmentId };

    const response = await fetch("/api/employees", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Operation failed");
      return;
    }

    clearForm();
    loadEmployees();
  }

  async function deleteEmployee(id: number) {
    await fetch("/api/employees", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadEmployees();
  }

  return (
    <main style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Employees</h1>

      <h2>{editingId ? "Edit Employee" : "Add Employee"}</h2>

      <form onSubmit={saveEmployee}>
        <p>
          <input
            placeholder="Employee name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </p>

        <p>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </p>

        {/* Department Dropdown */}
        <p>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(Number(e.target.value))}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </p>

        <button type="submit">
          {editingId ? "Update Employee" : "Add Employee"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={clearForm}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </form>

      <hr />

      <h2>Employee List</h2>

      {employees.length === 0 ? (
        <p>No employee added yet.</p>
      ) : (
        <ul>
          {employees.map((employee) => (
            <li key={employee.id}>
              {employee.name} — {employee.email} —{" "}
              {employee.department?.name}
              <button
                type="button"
                onClick={() => startEdit(employee)}
                style={{ marginLeft: "10px" }}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => deleteEmployee(employee.id)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <br />
      <Link href="/">← Back to Dashboard</Link>
    </main>
  );
}