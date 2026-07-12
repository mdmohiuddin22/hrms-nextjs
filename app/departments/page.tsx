"use client";

import { useEffect, useState } from "react";

type Department = {
  id: number;
  name: string;
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [name, setName] = useState("");

  const fetchDepartments = async () => {
    const res = await fetch("/api/departments");
    const data = await res.json();
    setDepartments(data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const addDepartment = async () => {
    if (!name.trim()) return;

    await fetch("/api/departments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    setName("");
    fetchDepartments();
  };

  const deleteDepartment = async (id: number) => {
    await fetch("/api/departments", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    fetchDepartments();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">🏢 Departments</h1>

      {/* Add Form */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Department name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={addDepartment}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white p-6 rounded-xl shadow">
        {departments.length === 0 ? (
          <p className="text-gray-400">No departments yet</p>
        ) : (
          <ul className="space-y-3">
            {departments.map((dept) => (
              <li
                key={dept.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>{dept.name}</span>
                <button
                  onClick={() => deleteDepartment(dept.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}