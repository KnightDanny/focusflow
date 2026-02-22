import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      tasks: {
        where: { parentId: null },
        select: { id: true, status: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const project = await prisma.project.create({
    data: {
      name: body.name,
      color: body.color || "#6366f1",
      icon: body.icon || null,
      userId: session.user.id,
    },
  });

  return NextResponse.json(project);
}
