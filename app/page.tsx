import { prisma } from "@/lib/prisma";

export default async function Dashboard() {
  const totalEmployees = await prisma.employee.count();

  const departments = await prisma.employee.findMany({
    select: { department: true },
    distinct: ["department"],
  });
  const totalDepartments = departments.length;

  const departmentStats = await prisma.employee.groupBy({
    by: ["department"],
    _count: { department: true },
  });

  const recentEmployees = await prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        📊 HRMS Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500 hover:shadow-lg hover:scale-105 transition duration-300">
          <p className="text-gray-500 text-sm">Total Employees</p>
          <h2 className="text-4xl font-bold text-blue-600 mt-2">
            {totalEmployees}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500 hover:shadow-lg hover:scale-105 transition duration-300">
          <p className="text-gray-500 text-sm">Total Departments</p>
          <h2 className="text-4xl font-bold text-green-600 mt-2">
            {totalDepartments}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500 hover:shadow-lg hover:scale-105 transition duration-300">
          <p className="text-gray-500 text-sm">Quick Link</p>
          <a
            href="/employees"
            className="inline-block mt-3 text-purple-600 font-semibold hover:underline"
          >
            + Manage Employees →
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Department-wise Employees
          </h3>
          {departmentStats.length === 0 ? (
            <p className="text-gray-400">কোনো data নেই</p>
          ) : (
            <ul className="space-y-3">
              {departmentStats.map((dept) => (
                <li
                  key={dept.department}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span className="text-gray-700">{dept.department}</span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {dept._count.department} জন
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recently Added Employees
          </h3>
          {recentEmployees.length === 0 ? (
            <p className="text-gray-400">কোনো employee নেই</p>
          ) : (
            <ul className="space-y-3">
              {recentEmployees.map((emp) => (
                <li
                  key={emp.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium text-gray-800">{emp.name}</p>
                    <p className="text-sm text-gray-500">{emp.department}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(emp.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}