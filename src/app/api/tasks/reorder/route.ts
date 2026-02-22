import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();
  const { orderedIds } = body as { orderedIds: string[] };

  // Update order for each task
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.task.updateMany({
        where: { id, userId },
        data: { order: index },
      })
    )
  );

  return NextResponse.json({ success: true });
}
