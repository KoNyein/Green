import fs from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

const sourceFile = process.env.GWAVE_SOURCE_SEED ?? "/home/ubuntu/gwave-ai-source/supabase/seed/knowledge_seed.sql";
const reportFile = process.env.GWAVE_IMPORT_REPORT ?? "/home/ubuntu/gwave-marketplace/docs/strain-import-report.json";
const sourceReference = "https://github.com/KoNyein/gwave.ai/tree/main/supabase/seed/knowledge";
const sourceLabel = "Imported from KoNyein/gwave.ai knowledge seed; pending staff/COA verification";

function unescapeSql(value) {
  return value.replace(/''/g, "'");
}

function splitTuple(tuple) {
  const fields = [];
  let current = "";
  let inString = false;
  let bracketDepth = 0;
  for (let i = 1; i < tuple.length - 1; i += 1) {
    const char = tuple[i];
    const next = tuple[i + 1];
    if (char === "'" && inString && next === "'") {
      current += "''";
      i += 1;
      continue;
    }
    if (char === "'") {
      inString = !inString;
      current += char;
      continue;
    }
    if (!inString && char === "[") bracketDepth += 1;
    if (!inString && char === "]") bracketDepth -= 1;
    if (!inString && bracketDepth === 0 && char === ",") {
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
}

function readSqlString(value) {
  const trimmed = value.trim();
  if (trimmed.toLowerCase() === "null") return null;
  const withoutCast = trimmed.replace(/::[a-zA-Z_]+(?:\[\])?$/, "").trim();
  if (withoutCast.startsWith("'") && withoutCast.endsWith("'")) {
    return unescapeSql(withoutCast.slice(1, -1));
  }
  return withoutCast;
}

function readArray(value) {
  const trimmed = value.trim();
  if (trimmed.toLowerCase() === "null") return [];
  const body = trimmed.replace(/^array\[/i, "").replace(/\]::text\[\]$/i, "");
  const result = [];
  const expression = /'((?:''|[^'])*)'/g;
  for (const match of body.matchAll(expression)) result.push(unescapeSql(match[1]));
  return result;
}

function readNumber(value) {
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function extractTuples(sql) {
  const valuesIndex = sql.indexOf("values");
  if (valuesIndex < 0) throw new Error("Could not find SQL values section");
  const tuples = [];
  let inString = false;
  let bracketDepth = 0;
  let tupleStart = -1;
  for (let i = valuesIndex + 6; i < sql.length; i += 1) {
    const char = sql[i];
    const next = sql[i + 1];
    if (char === "'" && inString && next === "'") {
      i += 1;
      continue;
    }
    if (char === "'") {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (char === "[") bracketDepth += 1;
    if (char === "]") bracketDepth -= 1;
    if (char === "(" && bracketDepth === 0 && tupleStart < 0) tupleStart = i;
    if (char === ")" && bracketDepth === 0 && tupleStart >= 0) {
      tuples.push(sql.slice(tupleStart, i + 1));
      tupleStart = -1;
    }
  }
  return tuples;
}

function parseRows(sql) {
  return extractTuples(sql).map((tuple, index) => {
    const fields = splitTuple(tuple);
    if (fields.length !== 13) return null;
    const [name, slug, classification, thc, cbd, effects, flavors, terpenes, difficulty, floweringWeeks, indoorYield, outdoorYield, description] = fields;
    return {
      name: readSqlString(name),
      slug: readSqlString(slug),
      classification: readSqlString(classification),
      thc: readNumber(thc),
      cbd: readNumber(cbd),
      effects: readArray(effects),
      flavors: readArray(flavors),
      terpenes: readArray(terpenes),
      difficulty: readSqlString(difficulty),
      floweringWeeks: readNumber(floweringWeeks),
      indoorYield: readSqlString(indoorYield),
      outdoorYield: readSqlString(outdoorYield),
      description: readSqlString(description),
    };
  }).filter(Boolean);
}

function normalize(row) {
  const name = String(row.name ?? "").trim();
  const slug = String(row.slug ?? "").trim().toLowerCase();
  const classification = ["indica", "sativa", "hybrid"].includes(row.classification) ? row.classification : "hybrid";
  const descriptor = [
    `Imported from the source knowledge dataset at ${sourceReference}.`,
    `Source classification: ${classification}.`,
    `Source effects: ${row.effects.join(", ") || "not supplied"}.`,
    `Source flavors: ${row.flavors.join(", ") || "not supplied"}.`,
    `Source terpenes: ${row.terpenes.join(", ") || "not supplied"}.`,
    `Growth metadata: difficulty ${row.difficulty || "not supplied"}; flowering ${row.floweringWeeks ?? "not supplied"} weeks; indoor yield ${row.indoorYield || "not supplied"}; outdoor yield ${row.outdoorYield || "not supplied"}.`,
  ].join(" ");
  return {
    slug,
    name,
    classification,
    verifiedFacts: `Imported source record only. Independent verification and COA review are pending. Source: ${sourceReference}`,
    supplierDescription: `${row.description || "No source description supplied."}\n\n${sourceLabel}`,
    educationalNote: descriptor,
    legalNotice: "This imported record is not a Certificate of Analysis and is not independently verified. Confirm legality, age requirements, and destination restrictions before any lawful use or transaction.",
    thcMinPercent: row.thc,
    thcMaxPercent: row.thc,
    cbdMinPercent: row.cbd,
    cbdMaxPercent: row.cbd,
    effectTags: row.effects,
    cannabinoidSource: `${sourceLabel}; THC/CBD values are unreviewed source values`,
    effectSource: `${sourceLabel}; effect tags are unreviewed source values`,
    profileReviewedAt: null,
    isPublished: false,
  };
}

const sql = await fs.readFile(sourceFile, "utf8");
const sourceRows = parseRows(sql);
const seen = new Set();
const duplicateSlugs = [];
const records = [];
for (const row of sourceRows) {
  const normalized = normalize(row);
  if (!normalized.name || !normalized.slug || normalized.name === "name" || normalized.slug === "slug") continue;
  if (seen.has(normalized.slug)) {
    duplicateSlugs.push(normalized.slug);
    continue;
  }
  seen.add(normalized.slug);
  records.push(normalized);
}

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [beforeRows] = await connection.query("SELECT COUNT(*) AS count FROM strains");
const beforeCount = Number(beforeRows[0].count);
const columns = ["slug", "name", "classification", "verifiedFacts", "supplierDescription", "educationalNote", "legalNotice", "thcMinPercent", "thcMaxPercent", "cbdMinPercent", "cbdMaxPercent", "effectTags", "cannabinoidSource", "effectSource", "profileReviewedAt", "isPublished"];
const chunkSize = 100;
let affectedRows = 0;
for (let start = 0; start < records.length; start += chunkSize) {
  const chunk = records.slice(start, start + chunkSize);
  const placeholders = chunk.map(() => `(${columns.map(() => "?").join(", ")})`).join(", ");
  const values = chunk.flatMap(record => [
    record.slug,
    record.name,
    record.classification,
    record.verifiedFacts,
    record.supplierDescription,
    record.educationalNote,
    record.legalNotice,
    record.thcMinPercent,
    record.thcMaxPercent,
    record.cbdMinPercent,
    record.cbdMaxPercent,
    JSON.stringify(record.effectTags),
    record.cannabinoidSource,
    record.effectSource,
    record.profileReviewedAt,
    record.isPublished ? 1 : 0,
  ]);
  const [result] = await connection.query(`INSERT INTO strains (${columns.join(", ")}) VALUES ${placeholders} ON DUPLICATE KEY UPDATE slug = VALUES(slug)`, values);
  affectedRows += result.affectedRows;
}
const [afterRows] = await connection.query("SELECT COUNT(*) AS count FROM strains");
const afterCount = Number(afterRows[0].count);
await connection.end();
const report = {
  sourceFile,
  sourceReference,
  sourceRows: sourceRows.length,
  importedUniqueRows: records.length,
  duplicateSlugs: duplicateSlugs.length,
  duplicateSlugSamples: duplicateSlugs.slice(0, 20),
  beforeCount,
  afterCount,
  newRows: afterCount - beforeCount,
  affectedRows,
  publicationDefault: "unpublished",
  verificationDefault: "unreviewed; no COA attached",
  generatedAt: new Date().toISOString(),
};
await fs.mkdir(path.dirname(reportFile), { recursive: true });
await fs.writeFile(reportFile, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
