"use client";

import { cn } from "@/lib/utils";

interface Props {
  result: string;
}

export default function LabResultFormattedView({ result }: Props) {
  const lines = result.split("\n");

  const renderLine = (line: string, idx: number) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={idx} className="h-2" />;
    }

    // 1. Quantitative Result Line (e.g. "> 5.2 (High) — mmol/L [Ref: 3.9-5.6]")
    if (trimmed.startsWith(">") && trimmed.includes("(") && trimmed.includes("[Ref:")) {
      const match = trimmed.match(/^>\s*([^(]+)\s*\(([^)]+)\)\s*—\s*([^[]+)\s*\[Ref:\s*([^\]]+)\]/);
      if (match) {
        const [, value, flag, unit, ref] = match;
        const isHigh = flag === "High";
        const isCritical = flag === "Critical";
        const isLow = flag === "Low";
        const isNormal = flag === "Normal";

        return (
          <div
            key={idx}
            className={cn(
              "my-1 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-2.5 transition-all",
              isCritical ? "border-status-crisis/40 bg-status-crisis/10 text-status-crisis" :
              isHigh ? "border-status-high-border bg-status-high-bg/80 text-status-high" :
              isLow ? "border-blue/30 bg-blue-bg/80 text-blue" :
              "border-status-normal-border/60 bg-status-normal-bg/40 text-ink"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="font-sans text-base font-bold tracking-tight text-ink">{value.trim()}</span>
              {unit.trim() && <span className="text-xs font-semibold text-ink-3">{unit.trim()}</span>}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider",
                  isCritical ? "bg-status-crisis text-white" :
                  isHigh ? "bg-status-high text-white" :
                  isLow ? "bg-blue text-white" :
                  "bg-status-normal text-white"
                )}
              >
                {flag}
              </span>
              <span className="text-xs font-medium text-ink-4">Ref: {ref.trim()}</span>
            </div>
          </div>
        );
      }
    }

    // 2. Section Headers (e.g. "FINAL CULTURE TEST REPORT", "ANTIBIOGRAM REPORT...")
    if (/^(FINAL CULTURE|ANTIBIOGRAM REPORT)/i.test(trimmed)) {
      return (
        <div key={idx} className="mt-3.5 mb-2 border-b border-border pb-1">
          <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-accent">{trimmed}</h4>
        </div>
      );
    }

    // 3. Susceptible / Resistant subheaders
    if (/^SUSCEPTIBLE:?$/i.test(trimmed)) {
      return (
        <div key={idx} className="mt-2.5 mb-1 text-xs font-bold uppercase tracking-wider text-status-normal flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-status-normal" />
          <span>Susceptible (S)</span>
        </div>
      );
    }
    if (/^RESISTANT:?$/i.test(trimmed)) {
      return (
        <div key={idx} className="mt-2.5 mb-1 text-xs font-bold uppercase tracking-wider text-status-high flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-status-high" />
          <span>Resistant (R)</span>
        </div>
      );
    }

    // 4. Antibiogram entries (e.g. "Amikacin — S" or "Ciprofloxacin — R")
    if (trimmed.includes("— S") || trimmed.includes("— R")) {
      const isS = trimmed.endsWith("— S");
      const drugName = trimmed.replace(/—\s*[SR]$/, "").trim();
      return (
        <div key={idx} className="flex items-center justify-between border-b border-border/40 py-1.5 px-1 font-sans text-xs">
          <span className="font-semibold text-ink">{drugName}</span>
          <span
            className={cn(
              "rounded-md px-2 py-0.5 font-bold text-xs uppercase tracking-wider",
              isS ? "bg-status-normal-bg text-status-normal border border-status-normal-border" :
              "bg-status-high-bg text-status-high border border-status-high-border"
            )}
          >
            {isS ? "Susceptible (S)" : "Resistant (R)"}
          </span>
        </div>
      );
    }

    // 5. Comments & Remarks (e.g. "COMMENT: ...", "REMARKS: ...")
    if (/^(COMMENT|REMARKS):/i.test(trimmed)) {
      const [label, ...rest] = trimmed.split(":");
      const note = rest.join(":").trim();
      return (
        <div key={idx} className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-3.5">
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-accent">{label}</div>
          <div className="font-sans text-xs font-semibold leading-relaxed text-ink">{note || "None"}</div>
        </div>
      );
    }

    // 6. Key-Value Rows (e.g. "HBsAg: POSITIVE", "Appearance: CLEAR", "Number of Organism(s): One (1)")
    if (trimmed.includes(":") && !trimmed.endsWith(":")) {
      const colonIdx = trimmed.indexOf(":");
      const key = trimmed.slice(0, colonIdx).trim();
      const val = trimmed.slice(colonIdx + 1).trim();

      const isPos = /^(POSITIVE|REACTIVE)/i.test(val);
      const isNeg = /^(NEGATIVE|NON-REACTIVE)/i.test(val);

      return (
        <div key={idx} className="flex items-center justify-between border-b border-border/50 py-2 px-1 font-sans text-xs">
          <span className="font-bold text-ink-3 uppercase tracking-wide">{key}</span>
          {isPos ? (
            <span className="rounded-full bg-status-high-bg border border-status-high-border px-2.5 py-0.5 text-xs font-bold text-status-high uppercase tracking-wide">
              {val}
            </span>
          ) : isNeg ? (
            <span className="rounded-full bg-status-normal-bg border border-status-normal-border px-2.5 py-0.5 text-xs font-bold text-status-normal uppercase tracking-wide">
              {val}
            </span>
          ) : (
            <span className="font-bold text-ink text-xs">{val}</span>
          )}
        </div>
      );
    }

    // 7. Test Label / Investigation Title
    if (trimmed.endsWith(":")) {
      return (
        <div key={idx} className="mt-2.5 mb-1 font-sans text-xs font-bold uppercase tracking-wider text-ink-2">
          {trimmed.replace(/:$/, "")}
        </div>
      );
    }

    // 8. General Text Line
    return (
      <div key={idx} className="font-sans text-xs font-semibold text-ink py-1 leading-relaxed">
        {trimmed}
      </div>
    );
  };

  return (
    <div className="space-y-1 font-sans">
      {lines.map((line, i) => renderLine(line, i))}
    </div>
  );
}
