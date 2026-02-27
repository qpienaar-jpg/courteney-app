export const SYMPTOM_CATEGORIES = {
  menstrual: {
    label: "Menstrual",
    color: "bg-courteney-pink-100 text-courteney-pink-500",
    examples: [
      "heavy bleeding",
      "irregular periods",
      "painful cramps",
      "spotting",
      "missed period",
      "prolonged bleeding",
    ],
  },
  pelvic: {
    label: "Pelvic",
    color: "bg-orange-100 text-orange-600",
    examples: [
      "pelvic pain",
      "pressure",
      "pain during intercourse",
      "vulvar discomfort",
    ],
  },
  hormonal: {
    label: "Hormonal",
    color: "bg-courteney-purple-100 text-courteney-purple-600",
    examples: [
      "hot flashes",
      "mood changes",
      "acne",
      "hair changes",
      "fatigue",
      "weight changes",
    ],
  },
  breast: {
    label: "Breast",
    color: "bg-blue-100 text-blue-600",
    examples: ["breast pain", "tenderness", "lumps", "discharge"],
  },
  urinary: {
    label: "Urinary",
    color: "bg-teal-100 text-teal-600",
    examples: [
      "frequent urination",
      "painful urination",
      "urgency",
      "incontinence",
    ],
  },
  other: {
    label: "Other",
    color: "bg-gray-100 text-gray-600",
    examples: ["bloating", "headaches", "back pain", "nausea"],
  },
} as const;

export const BODY_AREAS = {
  "lower-abdomen": "Lower Abdomen",
  pelvis: "Pelvis",
  breast: "Breast",
  back: "Back",
  head: "Head",
  "full-body": "Full Body",
  other: "Other",
} as const;

export const FREQUENCY_OPTIONS = {
  constant: "Constant",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  occasional: "Occasional",
} as const;

export type CategoryKey = keyof typeof SYMPTOM_CATEGORIES;
