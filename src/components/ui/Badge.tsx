import { SYMPTOM_CATEGORIES, type CategoryKey } from "@/lib/ai/symptom-categories";

interface BadgeProps {
  variant: CategoryKey;
  className?: string;
  children: React.ReactNode;
}

export default function Badge({ variant, className = "", children }: BadgeProps) {
  const category = SYMPTOM_CATEGORIES[variant];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${category.color} ${className}`}
    >
      {children}
    </span>
  );
}
