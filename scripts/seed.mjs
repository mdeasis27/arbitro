// scripts/seed.mjs
// Creates the arbitro schema + table and seeds a few demo verdicts.
// Run: node scripts/seed.mjs  (requires DATABASE_URL in env or .env.local)

import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

function loadEnv() {
  try {
    const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.trim().match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  } catch {
    /* no .env.local */
  }
}

loadEnv();

const sql = neon(process.env.DATABASE_URL);

const VERDICTS = [
  ["approve", "approve", "approve", 0.88, 0.6, "arbitrated", "approve"],
  ["approve", "approve", "deny", 0.72, 0.6, "arbitrated", "approve"],
  ["approve", "deny", "review", 0.65, 0.6, "escalated", null],
];

async function main() {
  await sql`CREATE SCHEMA IF NOT EXISTS arbitro`;
  await sql`DROP TABLE IF EXISTS arbitro.verdicts`;

  await sql`
    CREATE TABLE arbitro.verdicts (
      id serial PRIMARY KEY,
      a_label text NOT NULL,
      b_label text NOT NULL,
      c_label text NOT NULL,
      confidence numeric NOT NULL,
      threshold numeric NOT NULL,
      outcome text NOT NULL,
      label text,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;

  for (const [aLabel, bLabel, cLabel, confidence, threshold, outcome, label] of VERDICTS) {
    await sql`INSERT INTO arbitro.verdicts (a_label, b_label, c_label, confidence, threshold, outcome, label) VALUES (${aLabel}, ${bLabel}, ${cLabel}, ${confidence}, ${threshold}, ${outcome}, ${label})`;
  }

  const [{ c }] = await sql`SELECT count(*)::int AS c FROM arbitro.verdicts`;
  console.log(`Seeded arbitro schema: ${c} verdicts`);
}

main().catch((e) => {
  console.error("Seed failed:", e.message);
  process.exit(1);
});
