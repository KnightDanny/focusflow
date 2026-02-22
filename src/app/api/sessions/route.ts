import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const focusSession = await prisma.focusSession.create({
    data: {
      type: body.type,
      duration: body.duration,
      actualTime: body.actualTime,
      status: body.status,
      startedAt: new Date(body.startedAt),
      endedAt: new Date(),
      userId: session.user.id,
      taskId: body.taskId || null,
    },
  });

  return NextResponse.json(focusSession);
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "10");

  const sessions = await prisma.focusSession.findMany({
    where: { userId: session.user.id },
    include: { task: true },
    orderBy: { startedAt: "desc" },
    take: limit,
  });

  return NextResponse.json(sessions);
}
