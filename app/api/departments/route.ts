import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const departments = await prisma.department.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(departments);
}

export async function POST(request: Request) {
  const body = await request.json();

  const department = await prisma.department.create({
    data: {
      name: body.name,
    },
  });

  return NextResponse.json(department);
}

export async function DELETE(request: Request) {
  const body = await request.json();

  await prisma.department.delete({
    where: { id: body.id },
  });

  return NextResponse.json({ message: "Deleted successfully" });
}