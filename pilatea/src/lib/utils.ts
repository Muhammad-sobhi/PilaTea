export const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function storageUrl(path?: string | null): string | undefined {
  return path ? `${ASSET_BASE}/storage/${path}` : undefined;
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB");
}

export function eventDateParts(dateStr?: string | null): { month: string; day: string } {
  if (!dateStr) return { month: "", day: "" };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { month: "", day: "" };
  return { month: MONTH_NAMES[d.getMonth()], day: String(d.getDate()) };
}

export function getSetting(settings: Record<string, string>, key: string, fallback = ""): string {
  return settings[key] || fallback;
}
