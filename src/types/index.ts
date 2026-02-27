export type ConsultationStatus = "active" | "completed" | "cancelled";

export type SymptomCategory =
  | "menstrual"
  | "pelvic"
  | "hormonal"
  | "breast"
  | "urinary"
  | "other";

export type SymptomFrequency =
  | "constant"
  | "daily"
  | "weekly"
  | "monthly"
  | "occasional";

export type BodyArea =
  | "lower-abdomen"
  | "pelvis"
  | "breast"
  | "back"
  | "head"
  | "full-body"
  | "other";

export type MessageRole = "user" | "assistant" | "system";

export interface SymptomEntry {
  id: string;
  consultationId: string | null;
  name: string;
  category: SymptomCategory;
  onsetDate: string | null;
  severity: number | null;
  frequency: SymptomFrequency | null;
  triggers: string[];
  associatedSymptoms: string[];
  bodyArea: BodyArea | null;
  notes: string | null;
  createdAt: string;
}

export interface ConsultationEntry {
  id: string;
  startedAt: string;
  endedAt: string | null;
  status: ConsultationStatus;
  summary: string | null;
  symptoms: SymptomEntry[];
}
