export function getSeverityColor(severity: number): string {
  if (severity <= 3) return "text-green-600";
  if (severity <= 6) return "text-yellow-600";
  if (severity <= 8) return "text-orange-500";
  return "text-red-500";
}

export function getSeverityBgColor(severity: number): string {
  if (severity <= 3) return "bg-green-100";
  if (severity <= 6) return "bg-yellow-100";
  if (severity <= 8) return "bg-orange-100";
  return "bg-red-100";
}

export function getSeverityLabel(severity: number): string {
  if (severity <= 3) return "Mild";
  if (severity <= 6) return "Moderate";
  if (severity <= 8) return "Severe";
  return "Very Severe";
}
