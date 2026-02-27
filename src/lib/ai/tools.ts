import { z } from "zod";
import { prisma } from "@/lib/db";

const categoryValues = [
  "menstrual",
  "pelvic",
  "hormonal",
  "breast",
  "urinary",
  "other",
] as const;

const frequencyValues = [
  "constant",
  "daily",
  "weekly",
  "monthly",
  "occasional",
] as const;

const bodyAreaValues = [
  "lower-abdomen",
  "pelvis",
  "breast",
  "back",
  "head",
  "full-body",
  "other",
] as const;

export const logSymptomInputSchema = z.object({
  name: z.string().describe("Name of the symptom"),
  category: z
    .enum(categoryValues)
    .describe("Category the symptom falls under"),
  onsetDate: z
    .string()
    .optional()
    .describe("Approximate date the symptom started (ISO 8601 or natural language)"),
  severity: z
    .number()
    .min(1)
    .max(10)
    .optional()
    .describe("Severity rating from 1 (mild) to 10 (extreme)"),
  frequency: z
    .enum(frequencyValues)
    .optional()
    .describe("How often the symptom occurs"),
  triggers: z
    .array(z.string())
    .optional()
    .describe("Known triggers that worsen or improve the symptom"),
  associatedSymptoms: z
    .array(z.string())
    .optional()
    .describe("Other symptoms occurring alongside this one"),
  bodyArea: z
    .enum(bodyAreaValues)
    .optional()
    .describe("Primary body area affected"),
  notes: z
    .string()
    .optional()
    .describe("Any additional context or notes"),
});

export type LogSymptomInput = z.infer<typeof logSymptomInputSchema>;

/**
 * Creates the consultation tools object with a consultationId bound via closure.
 * This must be called inside the route handler so each request gets the correct ID.
 */
export function createConsultationTools(consultationId: string) {
  return {
    log_symptom: {
      description:
        "Logs a structured symptom entry to the user's health record. Call this after gathering sufficient details about a symptom during the consultation.",
      inputSchema: logSymptomInputSchema,
      execute: async (args: LogSymptomInput) => {
        const symptom = await prisma.symptom.create({
          data: {
            consultationId,
            name: args.name,
            category: args.category,
            onsetDate: args.onsetDate ? new Date(args.onsetDate) : null,
            severity: args.severity ?? null,
            frequency: args.frequency ?? null,
            triggers: args.triggers ? JSON.stringify(args.triggers) : null,
            associatedSymptoms: args.associatedSymptoms
              ? JSON.stringify(args.associatedSymptoms)
              : null,
            bodyArea: args.bodyArea ?? null,
            notes: args.notes ?? null,
          },
        });

        return {
          success: true,
          symptomId: symptom.id,
          message: `Successfully logged symptom: ${args.name}`,
        };
      },
    },
  };
}
