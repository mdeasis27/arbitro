import type { Heading } from "@/design-system/demo/project-story";

type NodeCopy = { name: string; sub: string; analogy: string };

export interface ArbitroStory {
  name: string;
  oneLiner: string;
  chips: string[];
  analogy: { heading: Heading; paragraphs: string[]; dictionaryLabel: string; dictionary: { term: string; means: string }[] };
  why: { title: string; text: string };
  tryIt: { heading: Heading; lead: string; question: (threshold: number) => string; yes: string; no: string; thresholdLabel: string; note: string; simulate: string; cancel: string; reset: string; error: string; idle: string };
  compare: { heading: Heading; lead: string; mine: (threshold: number) => string; without: string; wrong: string; sentence: (mine: number, without: number) => string; verdict: (reviewed: number) => string };
  fit: { heading: Heading; worthLabel: string; worth: string; notLabel: string; not: string };
  proves: { heading: Heading; text: string };
  engineers: { summary: string; points: string[]; repoLabel: string };
  scene: { title: string; caption: string; statusLabels: { active: string; danger: string; success: string }; tapeLabel: string; nodes: { plays: NodeCopy; judges: NodeCopy; settled: NodeCopy; referee: NodeCopy }; tape: { served: string; rerouted: string; lost: string }; reviewedOf: (n: number, total: number) => string };
}

const pct = (t: number) => Math.round(t * 100);

export const STORY: Record<"en" | "es", ArbitroStory> = {
  en: {
    name: "Candidate arbitration",
    oneLiner: "When the judges aren't sure, the play gets reviewed before it is called.",
    chips: ["Model agreement", "2 min", "Live demo"],
    analogy: {
      heading: { before: "The", accent: "analogy" },
      paragraphs: [
        "Three judges watch every play. If all three see the same thing, the call stands. If two agree but neither is very sure, the play goes to the video referee before anyone calls it.",
        "Here the judges are three models labelling the same request, and the referee is a person who reviews the doubtful ones. The slider decides how sure two judges must be to call a play on their own.",
      ],
      dictionaryLabel: "In the diagram below",
      dictionary: [
        { term: "the plays", means: "the requests to label" },
        { term: "the judges", means: "three models voting" },
        { term: "the video referee", means: "a person who reviews" },
        { term: "a wrong call", means: "a label that didn't match the right answer" },
      ],
    },
    why: { title: "Why I built it", text: "" },
    tryIt: {
      heading: { before: "Try", accent: "it" },
      lead: "Twenty-two plays that already happened, each labelled by three judges. The right call for every one is known, so we can count the mistakes.",
      question: (t) => `Before you run it, place a bet: if two judges need ${pct(t)}% confidence to decide alone, does the video referee review at most 4 of the 22 plays?`,
      yes: "Yes, 4 or fewer",
      no: "No, more than 4",
      thresholdLabel: "Confidence two judges need to decide alone",
      note: "Each square is one play, in order. Raise the slider and the judges call fewer plays on their own, so the referee gets more work.",
      simulate: "Run it",
      cancel: "Cancel",
      reset: "Start over",
      error: "The plays could not be judged. Try another confidence.",
      idle: "Place your bet and press Run it.",
    },
    compare: {
      heading: { before: "With the referee", accent: "or without" },
      lead: "Same plays, same judges. Without the referee, the most voted label decides every play, even a three-way split.",
      mine: (t) => `With the referee (${pct(t)}%)`,
      without: "Without the referee",
      wrong: "wrong calls",
      sentence: (mine, without) => {
        if (mine === without) return `Both ways ended with ${mine} wrong ${mine === 1 ? "call" : "calls"}.`;
        if (mine > without) return `This time the referee did worse: ${mine} wrong calls against ${without}.`;
        return `With the referee, ${mine} wrong ${mine === 1 ? "call" : "calls"}. Without it, ${without}.`;
      },
      verdict: (n) => n === 0 ? "The referee reviewed no plays" : n === 1 ? "The referee reviewed 1 play" : `The referee reviewed ${n} plays`,
    },
    fit: {
      heading: { before: "Where it", accent: "fits" },
      worthLabel: "Worth it",
      worth: "When a wrong label is expensive and a person can review a few cases a day. I think of a credit team sorting requests into approve, deny or review.",
      notLabel: "Not needed",
      not: "When one model is already right almost every time, or when nobody is available to review the doubtful cases.",
    },
    proves: {
      heading: { before: "What it", accent: "proves" },
      text: "Disagreement between models is useful information. I used it to decide which cases a person should see, and I counted what that costs in reviews and what it saves in mistakes.",
    },
    engineers: {
      summary: "For engineers",
      points: [
        "Unanimous votes are decided. A 2 vs 1 majority is decided only if its mean confidence clears the threshold; a three-way split always goes to review.",
        "The 22 cases and the rule are shared with the Python backend and pinned by the same fixture.",
        "Two cases stay wrong until about 89%: a confident majority overruling the one judge who was right. Review only catches doubt, not confident mistakes.",
        "Stack: Next.js 16, TypeScript, Python, Vitest, pytest.",
      ],
      repoLabel: "Source code",
    },
    scene: {
      title: "How each play was called",
      caption: "Watch the judges vote play by play, and see which ones go to the video referee.",
      statusLabels: { active: "voting", success: "in use", danger: "made wrong calls" },
      tapeLabel: "Twenty-two plays, in order",
      nodes: {
        plays: { name: "Plays", sub: "22 requests", analogy: "the plays" },
        judges: { name: "Judges", sub: "3 models", analogy: "the judges" },
        settled: { name: "Called", sub: "decided by votes", analogy: "the call stands" },
        referee: { name: "Review", sub: "a person checks", analogy: "the video referee" },
      },
      tape: { served: "called right", rerouted: "reviewed", lost: "called wrong" },
      reviewedOf: (n, total) => `Plays reviewed: ${n} of ${total}`,
    },
  },
  es: {
    name: "Arbitro",
    oneLiner: "Cuando los jueces no están seguros, la jugada se revisa antes de marcarla.",
    chips: ["Acuerdo entre modelos", "2 min", "Demo en vivo"],
    analogy: {
      heading: { accent: "La analogía" },
      paragraphs: [
        "Tres jueces ven cada jugada. Si los tres ven lo mismo, se marca. Si dos coinciden pero ninguno está muy seguro, la jugada va al árbitro de video antes de marcarse.",
        "Aquí los jueces son tres modelos que clasifican la misma solicitud, y el árbitro es una persona que revisa las dudosas. El slider decide qué tan seguros deben estar dos jueces para marcar una jugada solos.",
      ],
      dictionaryLabel: "En el diagrama de abajo",
      dictionary: [
        { term: "las jugadas", means: "las solicitudes por clasificar" },
        { term: "los jueces", means: "tres modelos que votan" },
        { term: "el árbitro de video", means: "una persona que revisa" },
        { term: "una marcación equivocada", means: "una etiqueta que no coincidió con la respuesta correcta" },
      ],
    },
    why: { title: "Por qué lo hice", text: "" },
    tryIt: {
      heading: { accent: "Pruébalo" },
      lead: "Veintidós jugadas que ya pasaron, cada una clasificada por tres jueces. Se sabe cuál era la marcación correcta de cada una, así que podemos contar los errores.",
      question: (t) => `Antes de correrlo, apuesta: si dos jueces necesitan ${pct(t)}% de confianza para decidir solos, ¿el árbitro de video revisa como máximo 4 de las 22 jugadas?`,
      yes: "Sí, 4 o menos",
      no: "No, más de 4",
      thresholdLabel: "Confianza que necesitan dos jueces para decidir solos",
      note: "Cada cuadrito es una jugada, en orden. Si subes el slider, los jueces marcan menos jugadas solos y el árbitro tiene más trabajo.",
      simulate: "Correr",
      cancel: "Cancelar",
      reset: "Empezar de nuevo",
      error: "No se pudieron juzgar las jugadas. Prueba con otra confianza.",
      idle: "Haz tu apuesta y presiona Correr.",
    },
    compare: {
      heading: { before: "Con árbitro", accent: "o sin él" },
      lead: "Mismas jugadas, mismos jueces. Sin árbitro, la etiqueta más votada decide cada jugada, aunque los tres jueces digan algo distinto.",
      mine: (t) => `Con árbitro (${pct(t)}%)`,
      without: "Sin árbitro",
      wrong: "marcaciones equivocadas",
      sentence: (mine, without) => {
        if (mine === without) return `Las dos formas terminaron con ${mine} ${mine === 1 ? "marcación equivocada" : "marcaciones equivocadas"}.`;
        if (mine > without) return `Esta vez al árbitro le fue peor: ${mine} marcaciones equivocadas contra ${without}.`;
        return `Con árbitro, ${mine} ${mine === 1 ? "marcación equivocada" : "marcaciones equivocadas"}. Sin él, ${without}.`;
      },
      verdict: (n) => n === 0 ? "El árbitro no revisó ninguna jugada" : n === 1 ? "El árbitro revisó 1 jugada" : `El árbitro revisó ${n} jugadas`,
    },
    fit: {
      heading: { before: "¿Dónde", accent: "sirve", after: "?" },
      worthLabel: "Vale la pena",
      worth: "Cuando una etiqueta equivocada sale cara y una persona puede revisar unos cuantos casos al día. Pienso en un equipo de crédito que separa solicitudes en aprobar, negar o revisar.",
      notLabel: "No hace falta",
      not: "Cuando un solo modelo ya acierta casi siempre, o cuando no hay nadie disponible para revisar los casos dudosos.",
    },
    proves: {
      heading: { before: "Lo que", accent: "demuestra" },
      text: "Que los modelos no estén de acuerdo es información útil. La usé para decidir qué casos debe ver una persona, y conté lo que eso cuesta en revisiones y lo que ahorra en errores.",
    },
    engineers: {
      summary: "Para ingenieros",
      points: [
        "Un voto unánime se decide. Una mayoría de 2 contra 1 se decide solo si su confianza promedio pasa el umbral; si los tres votan distinto, siempre va a revisión.",
        "Los 22 casos y la regla se comparten con el backend en Python y los fija el mismo fixture.",
        "Dos casos siguen mal hasta cerca de 89%: una mayoría muy segura que le gana al único juez que tenía razón. La revisión solo atrapa la duda, no los errores seguros.",
        "Stack: Next.js 16, TypeScript, Python, Vitest, pytest.",
      ],
      repoLabel: "Código fuente",
    },
    scene: {
      title: "Cómo se marcó cada jugada",
      caption: "Mira cómo votan los jueces jugada por jugada, y cuáles van al árbitro de video.",
      statusLabels: { active: "votando", success: "en uso", danger: "marcó jugadas mal" },
      tapeLabel: "Veintidós jugadas, en orden",
      nodes: {
        plays: { name: "Jugadas", sub: "22 solicitudes", analogy: "las jugadas" },
        judges: { name: "Jueces", sub: "3 modelos", analogy: "los jueces" },
        settled: { name: "Marcada", sub: "la deciden los votos", analogy: "la marcación queda" },
        referee: { name: "Revisión", sub: "una persona revisa", analogy: "el árbitro de video" },
      },
      tape: { served: "marcada bien", rerouted: "revisada", lost: "marcada mal" },
      reviewedOf: (n, total) => `Jugadas revisadas: ${n} de ${total}`,
    },
  },
};
