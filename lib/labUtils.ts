/**
 * Detects clinical flag (Normal, Low, High, Critical) by comparing a numerical result
 * against standard reference ranges (e.g. "3.5-5.0", "< 5.0", "> 1.0", "11.5–15.0").
 */
export function detectLabFlag(
  valueStr: string,
  refRangeStr: string
): "Normal" | "Low" | "High" | "Critical" | null {
  if (!valueStr || !refRangeStr) return null;

  // Extract primary floating point or integer number
  const numMatch = valueStr.trim().match(/[-+]?[0-9]*\.?[0-9]+/);
  if (!numMatch) return null;
  const val = parseFloat(numMatch[0]);
  if (isNaN(val)) return null;

  const cleanRef = refRangeStr.trim().replace(/\s+/g, " ");

  // 1. Check for "< X" or "<= X" (upper limit only)
  const ltMatch = cleanRef.match(/^<\s*=?\s*([0-9]*\.?[0-9]+)/);
  if (ltMatch) {
    const max = parseFloat(ltMatch[1]);
    if (!isNaN(max)) {
      if (val > max * 1.5) return "Critical";
      if (val > max) return "High";
      return "Normal";
    }
  }

  // 2. Check for "> X" or ">= X" (lower limit only)
  const gtMatch = cleanRef.match(/^>\s*=?\s*([0-9]*\.?[0-9]+)/);
  if (gtMatch) {
    const min = parseFloat(gtMatch[1]);
    if (!isNaN(min)) {
      if (val < min * 0.6) return "Critical";
      if (val < min) return "Low";
      return "Normal";
    }
  }

  // 3. Check for range: "MIN - MAX" / "MIN-MAX" / "MIN to MAX" / "MIN – MAX"
  const rangeMatch = cleanRef.match(
    /([0-9]*\.?[0-9]+)\s*(?:-|–|—|to)\s*([0-9]*\.?[0-9]+)/i
  );
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    if (!isNaN(min) && !isNaN(max)) {
      const span = max - min;
      // Critical threshold calculation: severe deviation beyond standard margins
      if (val < min - span * 0.6) return "Critical";
      if (val > max + span * 0.6) return "Critical";
      if (val < min) return "Low";
      if (val > max) return "High";
      return "Normal";
    }
  }

  return null;
}

/**
 * Returns default unit and reference range for known standalone single tests
 */
export function getDefaultTestRef(testName: string): { unit: string; ref: string } | null {
  const n = testName.toLowerCase();
  if (n.includes("hba1c")) return { unit: "%", ref: "4.0-5.6" };
  if (n.includes("fasting") && n.includes("glucose")) return { unit: "mmol/L", ref: "3.9-5.6" };
  if (n.includes("random blood sugar") || n.includes("rbs")) return { unit: "mmol/L", ref: "4.0-7.8" };
  if (n.includes("blood glucose")) return { unit: "mmol/L", ref: "3.9-6.1" };
  if (n.includes("uric acid")) return { unit: "umol/L", ref: "200-430" };
  if (n.includes("psa")) return { unit: "ng/mL", ref: "< 4.0" };
  if (n.includes("crp")) return { unit: "mg/L", ref: "< 5.0" };
  if (n.includes("esr")) return { unit: "mm/hr", ref: "0-20" };
  if (n.includes("calcium")) return { unit: "mmol/L", ref: "2.15-2.55" };
  if (n.includes("hemoglobin") || n.includes("haemoglobin") || n.includes("hb estimate") || n === "hb") {
    return { unit: "g/dL", ref: "11.5-15.0" };
  }
  return null;
}
