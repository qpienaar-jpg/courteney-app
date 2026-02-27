import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const consultations = await prisma.consultation.findMany({
    orderBy: { startedAt: "desc" },
    include: {
      _count: { select: { symptoms: true, messages: true } },
    },
  });

  return NextResponse.json({ consultations });
}
