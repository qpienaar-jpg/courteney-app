import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { format } from "date-fns";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { startDate, endDate } = body;

  const where: Record<string, unknown> = {};
  if (startDate || endDate) {
    const dateFilter: Record<string, Date> = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);
    where.createdAt = dateFilter;
  }

  const symptoms = await prisma.symptom.findMany({
    where,
    orderBy: { createdAt: "asc" },
    include: { consultation: { select: { id: true, startedAt: true } } },
  });

  const patterns = await prisma.pattern.findMany({
    orderBy: { identifiedAt: "desc" },
    take: 5,
  });

  // Compute summary statistics
  const symptomsWithSeverity = symptoms.filter((s) => s.severity !== null);
  const averageSeverity =
    symptomsWithSeverity.length > 0
      ? Math.round(
          (symptomsWithSeverity.reduce((a, s) => a + (s.severity ?? 0), 0) /
            symptomsWithSeverity.length) *
            10
        ) / 10
      : 0;

  const categoryCounts: Record<string, number> = {};
  symptoms.forEach((s) => {
    categoryCounts[s.category] = (categoryCounts[s.category] ?? 0) + 1;
  });

  const topCategory =
    Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ??
    "none";

  // Parse triggers
  const triggerCounts: Record<string, number> = {};
  symptoms.forEach((s) => {
    if (s.triggers) {
      try {
        const triggers = JSON.parse(s.triggers) as string[];
        triggers.forEach((t) => {
          triggerCounts[t] = (triggerCounts[t] ?? 0) + 1;
        });
      } catch {
        // skip
      }
    }
  });
  const topTriggers = Object.entries(triggerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  // Format symptoms for export
  const formattedSymptoms = symptoms.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    severity: s.severity,
    frequency: s.frequency,
    bodyArea: s.bodyArea,
    triggers: s.triggers ? JSON.parse(s.triggers) : [],
    associatedSymptoms: s.associatedSymptoms
      ? JSON.parse(s.associatedSymptoms)
      : [],
    notes: s.notes,
    date: format(s.createdAt, "MMM d, yyyy"),
    onsetDate: s.onsetDate ? format(s.onsetDate, "MMM d, yyyy") : null,
  }));

  return NextResponse.json({
    dateRange: {
      start: startDate || "All time",
      end: endDate || format(new Date(), "yyyy-MM-dd"),
    },
    symptoms: formattedSymptoms,
    stats: {
      totalLogged: symptoms.length,
      averageSeverity,
      topCategory,
      topTriggers,
      categoryCounts,
    },
    patterns: patterns.map((p) => ({
      description: p.description,
      confidence: p.confidence,
    })),
    generatedAt: new Date().toISOString(),
  });
}
