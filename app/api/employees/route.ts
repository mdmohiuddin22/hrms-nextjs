import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const employees = await prisma.employee.findMany({
    orderBy: { id: "desc" },
  });

  return NextResponse.json(employees);
}

export async function POST(request: Request) {
  const { name, email, department } = await request.json();

  if (!name || !email || !department) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const employee = await prisma.employee.create({
    data: { name, email, department },
  });

  return NextResponse.json(employee, { status: 201 });
}
export async function PUT(request: Request) {
  const { id, name, email, department } = await request.json();

  const employee = await prisma.employee.update({
    where: { id },
    data: { name, email, department },
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