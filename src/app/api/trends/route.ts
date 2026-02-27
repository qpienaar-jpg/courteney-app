import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { subDays, subMonths, format } from "date-fns";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const period = searchParams.get("period") ?? "30d";

  const now = new Date();
  let startDate: Date;
  switch (period) {
    case "7d":
      startDate = subDays(now, 7);
      break;
    case "30d":
      startDate = subDays(now, 30);
      break;
    case "90d":
      startDate = subDays(now, 90);
      break;
    case "1y":
      startDate = subMonths(now, 12);
      break;
    default:
      startDate = subDays(now, 30);
  }

  const symptoms = await prisma.symptom.findMany({
    where: { createdAt: { gte: startDate } },
    orderBy: { createdAt: "asc" },
  });

  // Frequency by day
  const frequencyByDay: Record<string, number> = {};
  symptoms.forEach((s) => {
    const day = format(s.createdAt, "yyyy-MM-dd");
    frequencyByDay[day] = (frequencyByDay[day] ?? 0) + 1;
  });

  // Average severity by day
  const severityAccum: Record<string, { total: number; count: number }> = {};
  symptoms.forEach((s) => {
    if (s.severity !== null) {
      const day = format(s.createdAt, "yyyy-MM-dd");
      if (!severityAccum[day]) severityAccum[day] = { total: 0, count: 0 };
      severityAccum[day].total += s.severity;
      severityAccum[day].count += 1;
    }
  });
  const severityByDay: Record<string, number> = {};
  for (const [day, v] of Object.entries(severityAccum)) {
    severityByDay[day] = Math.round((v.total / v.count) * 10) / 10;
  }

  // By category
  const byCategory: Record<string, number> = {};
  symptoms.forEach((s) => {
    byCategory[s.category] = (byCategory[s.category] ?? 0) + 1;
  });

  // By body area
  const byBodyArea: Record<string, number> = {};
  symptoms.forEach((s) => {
    if (s.bodyArea) {
      byBodyArea[s.bodyArea] = (byBodyArea[s.bodyArea] ?? 0) + 1;
    }
  });

  // Top triggers
  const triggerCounts: Record<string, number> = {};
  symptoms.forEach((s) => {
    if (s.triggers) {
      try {
        const triggers = JSON.parse(s.triggers) as string[];
        triggers.forEach((t) => {
          triggerCounts[t] = (triggerCounts[t] ?? 0) + 1;
        });
      } catch {
        // skip malformed JSON
      }
    }
  });
  const topTriggers = Object.entries(triggerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  // Summary stats
  const symptomsWithSeverity = symptoms.filter((s) => s.severity !== null);
  const averageSeverity =
    symptomsWithSeverity.length > 0
      ? Math.round(
          (symptomsWithSeverity.reduce((a, s) => a + (s.severity ?? 0), 0) /
            symptomsWithSeverity.length) *
            10
        ) / 10
      : 0;

  // Patterns
  const patterns = await prisma.pattern.findMany({
    orderBy: { identifiedAt: "desc" },
    take: 5,
  });

  return NextResponse.json({
    frequencyByDay,
    severityByDay,
    byCategory,
    byBodyArea,
    topTriggers,
    totalSymptoms: symptoms.length,
    averageSeverity,
    period,
    patterns,
  });
}
