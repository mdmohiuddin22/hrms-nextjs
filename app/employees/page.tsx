"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Employee = {
  id: number;
  name: string;
  email: string;
  department: string;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadEmployees() {
    const response = await fetch("/api/employees");
    const data = await response.json();
    setEmployees(data);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEmployees();
  }, []);

  function clearForm() {
    setName("");
    setEmail("");
    setDepartment("");
    setEditingId(null);
  }

  function startEdit(employee: Employee) {
    setEditingId(employee.id);
    setName(employee.name);
    setEmail(employee.email);
    setDepartment(employee.department);
  }

  async function saveEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const body = editingId
      ? { id: editingId, name, email, department }
      : { name, email, department };

    const response = await fetch("/api/employees", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const savedEmployee = await response.json();

    if (!response.ok) {
      alert(savedEmployee.error || "Operation failed");
      return;
    }

    if (editingId) {
      setEmployees(
        employees.map((employee) =>
          employee.id === savedEmployee.id ? savedEmployee : employee
        )
      );
    } else {
      setEmployees([savedEmployee, ...employees]);
    }

    clearForm();
  }

  async function deleteEmployee(id: number) {
    const response = await fetch("/api/employees", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setEmployees(employees.filter((employee) => employee.id !== id));
    }
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
            onChange={(event) => setName(event.target.value)}
            required
          />
        </p>

        <p>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </p>

        <p>
          <input
            placeholder="Department"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            required
          />
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
              {employee.name} — {employee.email} — {employee.department}

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