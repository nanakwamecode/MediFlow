import { resolvePanelFields } from "./extraLabPanels";

export interface QuantRow {
  label: string;
  value: string;
  flag: string;
  unit: string;
  refRange: string;
  group?: string;
}

export interface KeyValueRow {
  label: string;
  value: string;
  flag?: string;
}

export interface AntibiogramEntry {
  agent: string;
  sensitivity: "S" | "R";
}

export type ParsedLabReport =
  | { kind: "quant"; rows: QuantRow[]; remarks?: string }
  | {
      kind: "culture";
      summary: KeyValueRow[];
      isolateTitle?: string;
      antibiogram: AntibiogramEntry[];
      remarks?: string;
    }
  | { kind: "keyValue"; title?: string; rows: KeyValueRow[]; remarks?: string }
  | { kind: "text"; lines: string[]; remarks?: string };

const QUANT_LINE_RE =
  /^>\s*([^(]+?)\s*\(([^)]+)\)\s*—\s*([^[]*?)\s*\[Ref:\s*([^\]]*)\]$/;

export function isRenalTest(testName: string, rows?: QuantRow[]): boolean {
  const n = testName.toLowerCase();
  if (n.includes("renal") || n.includes("kidney") || n.includes("rft")) return true;
  return Boolean(rows?.some((r) => r.label.toLowerCase().includes("egfr")));
}

function normalizeFlag(raw: string): string {
  const upper = raw.trim().toUpperCase();
  if (upper === "HIGH" || upper === "LOW" || upper === "CRITICAL") return upper;
  if (upper === "NORMAL") return "Normal";
  return raw.trim();
}

function detectQualitativeFlag(val: string): string | undefined {
  const upper = val.trim().toUpperCase();
  if (/^(POSITIVE|REACTIVE)/.test(upper)) return "POSITIVE";
  if (/^(NEGATIVE|NON-REACTIVE)/.test(upper)) return "Normal";
  return undefined;
}

function extractRemarks(lines: string[]): { bodyLines: string[]; remarks?: string } {
  const bodyLines: string[] = [];
  const remarkParts: string[] = [];
  let inRemarks = false;

  for (const line of lines) {
    const trimmed = line.trim();
    const remarkMatch = trimmed.match(/^(?:COMMENT|REMARKS):\s*(.*)$/i);
    if (remarkMatch) {
      inRemarks = true;
      if (remarkMatch[1]?.trim()) remarkParts.push(remarkMatch[1].trim());
    } else if (inRemarks) {
      if (trimmed) remarkParts.push(trimmed);
    } else {
      bodyLines.push(line);
    }
  }
  return { bodyLines, remarks: remarkParts.length > 0 ? remarkParts.join(" ") : undefined };
}

function parseCultureReport(bodyLines: string[], remarks?: string): ParsedLabReport {
  const summary: KeyValueRow[] = [];
  const antibiogram: AntibiogramEntry[] = [];
  let isolateTitle: string | undefined;

  for (const line of bodyLines) {
    const trimmed = line.trim();
    if (!trimmed || /^FINAL CULTURE/i.test(trimmed)) continue;
    if (/^ANTIBIOGRAM REPORT/i.test(trimmed)) {
      const m = trimmed.match(/\(([^)]+)\)/);
      if (m?.[1] && m[1] !== "-") isolateTitle = m[1].trim();
      continue;
    }
    if (/^(SUSCEPTIBLE|RESISTANT):?$/i.test(trimmed)) continue;
    if (trimmed.endsWith("— S") || trimmed.endsWith("— R")) {
      const sensitivity = trimmed.endsWith("— S") ? "S" : "R";
      const agent = trimmed.replace(/—\s*[SR]$/, "").trim();
      if (agent && agent !== "None") antibiogram.push({ agent, sensitivity });
      continue;
    }
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx > 0 && !trimmed.endsWith(":")) {
      summary.push({ label: trimmed.slice(0, colonIdx).trim(), value: trimmed.slice(colonIdx + 1).trim() });
    }
  }
  return { kind: "culture", summary, isolateTitle, antibiogram, remarks };
}

function parseQuantitativeRows(bodyLines: string[], testName: string): QuantRow[] | null {
  const panelDefs = resolvePanelFields(testName);
  const groupByLabel = new Map<string, string>();
  if (panelDefs) {
    for (const def of panelDefs) {
      if (def.group) groupByLabel.set(def.label.toLowerCase(), def.group);
    }
  }

  const rows: QuantRow[] = [];
  let pendingLabel = "";
  for (const line of bodyLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith(">")) {
      const match = trimmed.match(QUANT_LINE_RE);
      if (match) {
        const [, val, flag, unit, refRange] = match;
        const label = pendingLabel || testName;
        rows.push({
          label,
          value: val.trim(),
          flag: normalizeFlag(flag),
          unit: unit.trim() || "—",
          refRange: refRange.trim() || "—",
          group: groupByLabel.get(label.toLowerCase()),
        });
        pendingLabel = "";
      }
    } else if (trimmed.endsWith(":")) {
      pendingLabel = trimmed.slice(0, -1).trim();
    }
  }
  if (rows.length === 0) return null;
  const hasPopulated = rows.some((r) => r.value !== "-" && r.value !== "");
  return hasPopulated ? rows.filter((r) => r.value !== "-" && r.value !== "") : rows;
}

export function parseLabResult(result: string, testName: string): ParsedLabReport {
  const rawLines = result.split(/\r?\n/);
  const { bodyLines, remarks } = extractRemarks(rawLines);
  const nonEmpty = bodyLines.map((l) => l.trim()).filter(Boolean);

  if (nonEmpty.some((l) => /^FINAL CULTURE/i.test(l))) {
    return parseCultureReport(bodyLines, remarks);
  }

  const quantRows = parseQuantitativeRows(bodyLines, testName);
  if (quantRows) return { kind: "quant", rows: quantRows, remarks };

  let title: string | undefined;
  const kvRows: KeyValueRow[] = [];
  const plainLines: string[] = [];

  for (const trimmed of nonEmpty) {
    if (!trimmed.includes(":") && kvRows.length === 0 && !title) {
      title = trimmed;
      continue;
    }
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx > 0 && !trimmed.endsWith(":")) {
      const label = trimmed.slice(0, colonIdx).trim();
      const value = trimmed.slice(colonIdx + 1).trim();
      kvRows.push({ label, value, flag: detectQualitativeFlag(value) });
    } else {
      plainLines.push(trimmed);
    }
  }

  if (kvRows.length > 0 && plainLines.length === 0) {
    const hasPopulated = kvRows.some((r) => r.value !== "-" && r.value !== "");
    const filtered = hasPopulated ? kvRows.filter((r) => r.value !== "-" && r.value !== "") : kvRows;
    return { kind: "keyValue", title, rows: filtered, remarks };
  }

  return { kind: "text", lines: nonEmpty, remarks };
}
