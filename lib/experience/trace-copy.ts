const COPY: Record<string, { en: string; es: string }> = {
  "play.served": { en: "called right by the judges", es: "bien marcada por los jueces" },
  "play.rerouted": { en: "sent to the video referee", es: "enviada al árbitro de video" },
  "play.lost": { en: "called wrong by the judges", es: "mal marcada por los jueces" },
};
const LEGACY: Record<string, { en: string; es: string }> = { approve: { en: "approve", es: "aprobar" }, deny: { en: "deny", es: "denegar" }, review: { en: "review", es: "revisión" }, arbitrated: { en: "arbitrated", es: "resuelto" }, escalated: { en: "escalated", es: "escalado" } };
export function traceCopy(locale: "en" | "es", key: string) { return (COPY[key] ?? LEGACY[key])?.[locale] ?? key; }
