const COPY: Record<string, { en: string; es: string }> = {
  "batch.1": { en: "plays 1 to 6 judged", es: "jugadas 1 a 6 juzgadas" },
  "batch.2": { en: "plays 7 to 12 judged", es: "jugadas 7 a 12 juzgadas" },
  "batch.3": { en: "plays 13 to 18 judged", es: "jugadas 13 a 18 juzgadas" },
  "batch.4": { en: "plays 19 to 22 judged", es: "jugadas 19 a 22 juzgadas" },
};
const LEGACY: Record<string, { en: string; es: string }> = { approve: { en: "approve", es: "aprobar" }, deny: { en: "deny", es: "denegar" }, review: { en: "review", es: "revisión" }, arbitrated: { en: "arbitrated", es: "resuelto" }, escalated: { en: "escalated", es: "escalado" } };
export function traceCopy(locale: "en" | "es", key: string) { return (COPY[key] ?? LEGACY[key])?.[locale] ?? key; }
