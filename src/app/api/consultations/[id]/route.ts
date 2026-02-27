import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const consultation = await prisma.consultation.findUnique({
    where: { id: params.id },
    include: {
      messages: { orderBy: { timestamp: "asc" } },
      symptoms: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!consultation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ consultation });
}
