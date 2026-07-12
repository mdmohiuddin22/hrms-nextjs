import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const employees = await prisma.employee.findMany({
    include: {
      department: true,
    },
  });

  return NextResponse.json(employees);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const employee = await prisma.employee.create({
      data: {
        name: body.name,
        email: body.email,
        departmentId: Number(body.departmentId),
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request) {
  const { id, name, email, departmentId } = await request.json();

  const employee = await prisma.employee.update({
    where: { id },
    data: { name, email, departmentId: Number(departmentId) },
  });

  return NextResponse.json(employee);
}
export async function DELETE(request: Request) {
  const { id } = await request.json();

  await prisma.employee.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Employee deleted" });
}