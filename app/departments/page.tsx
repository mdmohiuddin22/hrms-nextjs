"use client";

import { useEffect, useState } from "react";

interface Department {
  id: number;
  name: string;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  async function fetchDepartments() {
    const res = await fetch("/api/departments");
    const data = await res.json();
    setDepartments(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setName("");
      fetchDepartments();
    } else {
      alert("Failed to add department");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Departments</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Department name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border px-3 py-2 rounded w-64"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>

      {departments.length === 0 ? (
        <p>No departments yet.</p>
      ) : (
        <ul className="space-y-2">
          {departments.map((dept) => (
            <li
              key={dept.id}
              className="border px-3 py-2 rounded bg-gray-50"
            >
              {dept.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}