// Use dynamic import to handle Prisma v7 ESM generated client
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const { PrismaNeon } = await import("@prisma/adapter-neon");

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.pattern.deleteMany();
  await prisma.symptom.deleteMany();
  await prisma.message.deleteMany();
  await prisma.consultation.deleteMany();

  const now = new Date();
  const DAY = 24 * 60 * 60 * 1000;

  const c1 = await prisma.consultation.create({
    data: {
      status: "completed",
      startedAt: new Date(now.getTime() - 90 * DAY),
      endedAt: new Date(now.getTime() - 90 * DAY + 15 * 60 * 1000),
      summary: "Initial consultation about menstrual irregularities and pelvic pain.",
    },
  });

  const c2 = await prisma.consultation.create({
    data: {
      status: "completed",
      startedAt: new Date(now.getTime() - 60 * DAY),
      endedAt: new Date(now.getTime() - 60 * DAY + 12 * 60 * 1000),
      summary: "Follow-up about ongoing pelvic pain and new fatigue symptoms.",
    },
  });

  const c3 = await prisma.consultation.create({
    data: {
      status: "completed",
      startedAt: new Date(now.getTime() - 30 * DAY),
      endedAt: new Date(now.getTime() - 30 * DAY + 10 * 60 * 1000),
      summary: "Reported worsening cramps and bloating around cycle.",
    },
  });

  const c4 = await prisma.consultation.create({
    data: {
      status: "completed",
      startedAt: new Date(now.getTime() - 14 * DAY),
      endedAt: new Date(now.getTime() - 14 * DAY + 8 * 60 * 1000),
      summary: "Reported heavy bleeding and lower back pain during period.",
    },
  });

  const c5 = await prisma.consultation.create({
    data: {
      status: "completed",
      startedAt: new Date(now.getTime() - 3 * DAY),
      endedAt: new Date(now.getTime() - 3 * DAY + 10 * 60 * 1000),
      summary: "Discussed recurring pelvic pain and mood changes.",
    },
  });

  await prisma.message.createMany({
    data: [
      { consultationId: c1.id, role: "assistant", content: "Hi there! I'm Courteney, your health tracking assistant. What symptoms would you like to log today?", timestamp: new Date(now.getTime() - 90 * DAY) },
      { consultationId: c1.id, role: "user", content: "I've been having really irregular periods and some pelvic pain.", timestamp: new Date(now.getTime() - 90 * DAY + 60000) },
      { consultationId: c1.id, role: "assistant", content: "I'm sorry to hear that. Let's start with the irregular periods. When did you first notice your cycle becoming irregular?", timestamp: new Date(now.getTime() - 90 * DAY + 120000) },
      { consultationId: c1.id, role: "user", content: "About 4 months ago. My cycle used to be regular at 28 days but now it varies from 21 to 40 days.", timestamp: new Date(now.getTime() - 90 * DAY + 180000) },
    ],
  });

  const symptoms = [
    { consultationId: c1.id, name: "Irregular periods", category: "menstrual", severity: 6, frequency: "monthly", triggers: JSON.stringify(["stress", "poor sleep"]), associatedSymptoms: JSON.stringify(["mood changes", "bloating"]), bodyArea: "lower-abdomen", notes: "Cycle varies 21-40 days, previously regular at 28 days.", createdAt: new Date(now.getTime() - 90 * DAY) },
    { consultationId: c1.id, name: "Pelvic pain", category: "pelvic", severity: 5, frequency: "weekly", triggers: JSON.stringify(["physical activity", "menstruation"]), associatedSymptoms: JSON.stringify(["lower back pain"]), bodyArea: "pelvis", notes: "Dull aching pain, worse during period.", createdAt: new Date(now.getTime() - 90 * DAY) },
    { consultationId: c2.id, name: "Pelvic pain", category: "pelvic", severity: 6, frequency: "weekly", triggers: JSON.stringify(["menstruation", "sitting for long periods"]), associatedSymptoms: JSON.stringify(["lower back pain", "bloating"]), bodyArea: "pelvis", notes: "Pain has increased slightly since last month.", createdAt: new Date(now.getTime() - 60 * DAY) },
    { consultationId: c2.id, name: "Fatigue", category: "hormonal", severity: 7, frequency: "daily", triggers: JSON.stringify(["before period", "poor sleep"]), associatedSymptoms: JSON.stringify(["difficulty concentrating", "mood changes"]), bodyArea: "full-body", notes: "Persistent tiredness even after 8 hours of sleep.", createdAt: new Date(now.getTime() - 60 * DAY) },
    { consultationId: c3.id, name: "Menstrual cramps", category: "menstrual", severity: 7, frequency: "monthly", triggers: JSON.stringify(["first day of period"]), associatedSymptoms: JSON.stringify(["nausea", "lower back pain"]), bodyArea: "lower-abdomen", notes: "Cramps have worsened over the past month.", createdAt: new Date(now.getTime() - 30 * DAY) },
    { consultationId: c3.id, name: "Bloating", category: "other", severity: 5, frequency: "weekly", triggers: JSON.stringify(["before period", "certain foods"]), associatedSymptoms: JSON.stringify(["pelvic pressure"]), bodyArea: "lower-abdomen", notes: "Noticeable bloating in the week before period.", createdAt: new Date(now.getTime() - 30 * DAY) },
    { consultationId: c4.id, name: "Heavy menstrual bleeding", category: "menstrual", severity: 8, frequency: "monthly", triggers: JSON.stringify(["period"]), associatedSymptoms: JSON.stringify(["fatigue", "dizziness"]), bodyArea: "lower-abdomen", notes: "Soaking through a pad every 2 hours on heaviest days.", createdAt: new Date(now.getTime() - 14 * DAY) },
    { consultationId: c4.id, name: "Lower back pain", category: "pelvic", severity: 6, frequency: "weekly", triggers: JSON.stringify(["menstruation", "standing for long periods"]), associatedSymptoms: JSON.stringify(["pelvic pain"]), bodyArea: "back", notes: "Radiates from lower back into hips during period.", createdAt: new Date(now.getTime() - 14 * DAY) },
    { consultationId: c5.id, name: "Pelvic pain", category: "pelvic", severity: 7, frequency: "daily", triggers: JSON.stringify(["intercourse", "physical activity", "menstruation"]), associatedSymptoms: JSON.stringify(["bloating", "lower back pain", "fatigue"]), bodyArea: "pelvis", notes: "Pain is now occurring daily, not just around period.", createdAt: new Date(now.getTime() - 3 * DAY) },
    { consultationId: c5.id, name: "Mood changes", category: "hormonal", severity: 5, frequency: "weekly", triggers: JSON.stringify(["before period", "pain episodes"]), associatedSymptoms: JSON.stringify(["fatigue", "irritability"]), bodyArea: "full-body", notes: "Increased anxiety and irritability, particularly premenstrually.", createdAt: new Date(now.getTime() - 3 * DAY) },
  ];

  for (const symptom of symptoms) {
    await prisma.symptom.create({ data: symptom });
  }

  const allSymptoms = await prisma.symptom.findMany();
  const pelvicPainIds = allSymptoms.filter((s) => s.name === "Pelvic pain").map((s) => s.id);
  const menstrualIds = allSymptoms.filter((s) => s.category === "menstrual").map((s) => s.id);
  const fatigueAndMoodIds = allSymptoms.filter((s) => ["Fatigue", "Mood changes"].includes(s.name)).map((s) => s.id);

  await prisma.pattern.createMany({
    data: [
      { description: "Pelvic pain severity increasing over 3 months (5 to 7/10), frequency changed from weekly to daily.", symptomIds: JSON.stringify(pelvicPainIds), confidence: 0.85, identifiedAt: new Date(now.getTime() - DAY) },
      { description: "Menstrual symptoms consistently co-occurring with pelvic pain and lower back pain.", symptomIds: JSON.stringify(menstrualIds), confidence: 0.78, identifiedAt: new Date(now.getTime() - DAY) },
      { description: "Fatigue and mood changes correlate with premenstrual phase and pain severity increases.", symptomIds: JSON.stringify(fatigueAndMoodIds), confidence: 0.72, identifiedAt: new Date(now.getTime() - DAY) },
    ],
  });

  console.log("Seed completed!");
  console.log(`Created ${symptoms.length} symptoms across 5 consultations, 3 patterns`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
