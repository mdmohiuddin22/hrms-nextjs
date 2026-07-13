import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET All Employees
export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: { department: true },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

// ✅ POST New Employee
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 🔹 Auto Generate Employee Code
    const lastEmployee = await prisma.employee.findFirst({
      orderBy: { id: "desc" },
    });

    let nextNumber = 1;

    if (lastEmployee?.employeeCode) {
      const lastNumber = parseInt(lastEmployee.employeeCode.split("-")[1]);
      nextNumber = lastNumber + 1;
    }

    const employeeCode = `EMP-${String(nextNumber).padStart(4, "0")}`;

    const employee = await prisma.employee.create({
      data: {
        employeeCode,
        firstName: body.firstName,
        lastName: body.lastName,
        fullName: `${body.firstName} ${body.lastName}`,
        departmentId: parseInt(body.departmentId),
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }
}