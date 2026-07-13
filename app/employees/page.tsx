"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  async function fetchEmployees() {
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data);
  }

  async function fetchDepartments() {
    const res = await fetch("/api/departments");
    const data = await res.json();
    setDepartments(data);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, departmentId }),
    });

    if (res.ok) {
      setFirstName("");
      setLastName("");
      setDepartmentId("");
      fetchEmployees();
    } else {
      alert("Failed to create employee");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Employees</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <br /><br />

        <input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <br /><br />

        <select
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          required
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        <br /><br />
        <button type="submit">Add Employee</button>
      </form>

      <h3>Employee List</h3>

      {employees.length === 0 ? (
        <p>No employee added yet.</p>
      ) : (
        <ul>
          {employees.map((emp) => (
            <li key={emp.id}>
              {emp.employeeCode} - {emp.fullName} ({emp.department.name})
            </li>
          ))}
        </ul>
      )}

      <br />
      <Link href="/">← Back to Dashboard</Link>
    </div>
  );
}