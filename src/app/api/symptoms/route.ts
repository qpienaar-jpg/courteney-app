import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const keyword = searchParams.get("keyword");
  const category = searchParams.get("category");
  const minSeverity = searchParams.get("minSeverity");
  const maxSeverity = searchParams.get("maxSeverity");
  const bodyArea = searchParams.get("bodyArea");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const where: Record<string, unknown> = {};

  if (keyword) {
    where.OR = [
      { name: { contains: keyword } },
      { notes: { contains: keyword } },
    ];
  }
  if (category) where.category = category;
  if (bodyArea) where.bodyArea = bodyArea;
  if (minSeverity || maxSeverity) {
    const sevFilter: Record<string, number> = {};
    if (minSeverity) sevFilter.gte = parseInt(minSeverity);
    if (maxSeverity) sevFilter.lte = parseInt(maxSeverity);
    where.severity = sevFilter;
  }
  if (startDate || endDate) {
    const dateFilter: Record<string, Date> = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);
    where.createdAt = dateFilter;
  }

  const [symptoms, total] = await Promise.all([
    prisma.symptom.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { consultation: { select: { id: true, status: true } } },
    }),
    prisma.symptom.count({ where }),
  ]);

  return NextResponse.json({ symptoms, total, page, limit });
}

export async function POST(req: Request) {
  const body = await req.json();
  const symptom = await prisma.symptom.create({
    data: {
      ...body,
      triggers: body.triggers ? JSON.stringify(body.triggers) : null,
      associatedSymptoms: body.associatedSymptoms
        ? JSON.stringify(body.associatedSymptoms)
        : null,
      onsetDate: body.onsetDate ? new Date(body.onsetDate) : null,
    },
  });
  return NextResponse.json(symptom, { status: 201 });
}
