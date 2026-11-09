// Fase 6.33 (7): compuerta de `npm audit` para CI.
//
// Uso:
//   npm audit --omit=dev --json > npm-audit.json || true
//   node scripts/audit-gate.mjs npm-audit.json security/accepted-advisories.json
//
// Falla (código 1) sólo si:
// - hay un aviso alto o crítico de producción que no está en la lista de
//   aceptados, o
// - una aceptación ya pasó su fecha de revisión (`review_by`).
// Los moderados y bajos se listan, pero no fallan. Una salida de npm que no
// se puede leer también falla (código 2): nunca se da por buena una
// auditoría que no corrió.
import { readFileSync } from "node:fs";

const [auditFile, acceptedFile] = process.argv.slice(2);

if (!auditFile || !acceptedFile) {
  console.error("Uso: node scripts/audit-gate.mjs <npm-audit.json> <accepted-advisories.json>");
  process.exit(2);
}

function readJson(file, what) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    console.error(`${what} no se pudo leer (${file}).`);
    process.exit(2);
  }
}

const audit = readJson(auditFile, "La salida de npm audit");
if (!audit || typeof audit.vulnerabilities !== "object" || !audit.metadata) {
  console.error(`La salida de npm audit no tiene el formato esperado (${auditFile}).`);
  process.exit(2);
}

const acceptedData = readJson(acceptedFile, "La lista de avisos aceptados");
if (!Array.isArray(acceptedData.npm)) {
  console.error(`La lista de avisos aceptados no tiene la llave "npm" (${acceptedFile}).`);
  process.exit(2);
}

const today = new Date().toISOString().slice(0, 10);
let failed = false;
const accepted = new Map();

for (const entry of acceptedData.npm) {
  for (const field of ["id", "package", "severity", "scope", "reason", "accepted_on", "review_by"]) {
    if (typeof entry[field] !== "string" || entry[field] === "") {
      console.error(`Aceptación incompleta: falta "${field}" en ${JSON.stringify(entry)}`);
      process.exit(2);
    }
  }
  if (entry.review_by < today) {
    console.log(`FALLA  aceptación vencida: ${entry.id} (${entry.package}) debía revisarse el ${entry.review_by}.`);
    failed = true;
  }
  accepted.set(`${entry.package}|${entry.id}`, entry);
}

// Cada aviso aparece como objeto en `via` del paquete afectado; los
// paquetes que sólo dependen de él lo citan por nombre (texto).
const advisories = new Map();
for (const [name, vulnerability] of Object.entries(audit.vulnerabilities)) {
  for (const via of vulnerability.via ?? []) {
    if (typeof via !== "object") continue;
    const id = String(via.url ?? via.source).split("/").pop();
    advisories.set(`${via.name ?? name}|${id}`, { id, package: via.name ?? name, severity: via.severity, title: via.title, range: via.range });
  }
}

const seen = new Set();
for (const [key, advisory] of advisories) {
  const label = `${advisory.id} ${advisory.package} [${advisory.severity}] ${advisory.title} (${advisory.range})`;
  if (accepted.has(key)) {
    seen.add(key);
    console.log(`acept. ${label} (revisar el ${accepted.get(key).review_by})`);
  } else if (["high", "critical"].includes(advisory.severity)) {
    console.log(`FALLA  ${label}`);
    failed = true;
  } else {
    console.log(`aviso  ${label}`);
  }
}

for (const [key, entry] of accepted) {
  if (!seen.has(key)) {
    console.log(`nota   ${entry.id} (${entry.package}, ${entry.scope}) no aparece en esta auditoría.`);
  }
}

console.log(
  failed
    ? "npm audit: hay avisos altos o críticos de producción sin aceptar, o aceptaciones vencidas."
    : `npm audit: ${advisories.size} avisos en esta auditoría; ninguno alto o crítico sin aceptar.`,
);
process.exit(failed ? 1 : 0);
