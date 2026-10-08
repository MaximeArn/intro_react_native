// "octobre 2026" à partir d'une date Firebase (chaîne ISO ou timestamp en ms)
export function formatMonthYear(raw?: string | number | null): string | null {
  if (raw == null || raw === "") return null;

  const numeric = Number(raw);
  const date = new Date(Number.isNaN(numeric) ? raw : numeric);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

export function formatLongDate(date: Date | null): string | null {
  if (!date || Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
