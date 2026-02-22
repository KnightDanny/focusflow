import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const projectId = searchParams.get("projectId");
  const search = searchParams.get("search");

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      parentId: null,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(projectId && { projectId }),
      ...(search && { title: { contains: search } }),
    },
    include: {
      subtasks: { orderBy: { order: "asc" } },
      tags: true,
      project: true,
    },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Get the max order for this user's tasks
  const maxOrder = await prisma.task.aggregate({
    where: { userId: session.user.id, parentId: null },
    _max: { order: true },
  });

  const task = await prisma.task.create({
    data: {
      title: body.title,
      description: body.description || null,
      status: body.status || "TODO",
      priority: body.priority || "MEDIUM",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      order: (maxOrder._max.order ?? -1) + 1,
      userId: session.user.id,
      projectId: body.projectId || null,
      parentId: body.parentId || null,
    },
    include: {
      subtasks: true,
      tags: true,
      project: true,
    },
  });

  return NextResponse.json(task);
}
