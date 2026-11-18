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

export { getDefaultTestRef } from "./labRefRanges";

/**
 * Automatically generates a clinical comment/interpretation for a Hepatitis B 5-marker profile.
 */
export function generateHepBInterpretation(fields: {
  HBsAg?: string;
  HBsAb?: string;
  HBeAg?: string;
  HBeAb?: string;
  HBcAb?: string;
}): string {
  const norm = (v?: string) => (v ? v.trim().toUpperCase() : "");
  const ag = norm(fields.HBsAg);
  const ab = norm(fields.HBsAb);
  const eAg = norm(fields.HBeAg);
  const eAb = norm(fields.HBeAb);
  const cAb = norm(fields.HBcAb);

  if (!ag && !ab && !eAg && !eAb && !cAb) return "";

  const isPos = (v: string) => v === "POSITIVE" || v === "REACTIVE";
  const isNeg = (v: string) => v === "NEGATIVE" || v === "NON-REACTIVE";

  const agPos = isPos(ag);
  const agNeg = isNeg(ag);
  const abPos = isPos(ab);
  const abNeg = isNeg(ab);
  const eAgPos = isPos(eAg);
  const eAgNeg = isNeg(eAg);
  const eAbPos = isPos(eAb);
  const eAbNeg = isNeg(eAb);
  const cAbPos = isPos(cAb);
  const cAbNeg = isNeg(cAb);

  // 1. Chronic Inactive (Carrier): HBsAg (+), HBeAg (-), HBeAb (+), HBcAb (+)
  if (agPos && eAgNeg && eAbPos && cAbPos) {
    return "CHRONIC INACTIVE VIRAL HEPATITIS B INFECTION";
  }

  // 2. Chronic Active (High Replication): HBsAg (+), HBeAg (+), HBcAb (+)
  if (agPos && eAgPos && cAbPos) {
    return "CHRONIC ACTIVE VIRAL HEPATITIS B INFECTION (HIGH REPLICATION)";
  }

  // 3. Co-existing HBsAg and HBsAb (Atypical)
  if (agPos && abPos) {
    return "CO-EXISTING HBsAg AND HBsAb DETECTED. ATYPICAL PROFILE, CLINICAL CORRELATION RECOMMENDED";
  }

  // 4. Chronic Hepatitis B (General)
  if (agPos && cAbPos && !abPos) {
    return "CHRONIC VIRAL HEPATITIS B INFECTION";
  }

  // 5. Early acute / Incubation
  if (agPos && abNeg && cAbNeg) {
    return "EARLY ACUTE HEPATITIS B INFECTION (INCUBATION PERIOD)";
  }

  // 6. Generic HBsAg Positive
  if (agPos) {
    return "HEPATITIS B VIRUS INFECTION DETECTED";
  }

  // 7. Immune due to natural infection (Resolved): HBsAg (-), HBsAb (+), HBcAb (+)
  if (agNeg && abPos && cAbPos) {
    return "IMMUNE DUE TO NATURAL INFECTION (RESOLVED HEPATITIS B)";
  }

  // 8. Immune due to vaccination: HBsAg (-), HBsAb (+), HBcAb (-)
  if (agNeg && abPos && cAbNeg) {
    return "IMMUNE DUE TO HEPATITIS B VACCINATION";
  }

  // 9. Resolving infection / Window period: HBsAg (-), HBsAb (-), HBeAb (+), HBcAb (+)
  if (agNeg && abNeg && eAbPos && cAbPos) {
    return "RESOLVING HEPATITIS B INFECTION (WINDOW PERIOD)";
  }

  // 10. Isolated Core Antibody: HBsAg (-), HBsAb (-), HBcAb (+)
  if (agNeg && abNeg && cAbPos) {
    return "ISOLATED CORE ANTIBODY (ANTI-HBc POSITIVE). POSSIBLE RESOLVED INFECTION OR LOW-LEVEL CARRIER";
  }

  // 11. Susceptible (All negative): HBsAg (-), HBsAb (-), HBcAb (-)
  if (agNeg && abNeg && cAbNeg) {
    return "SUSCEPTIBLE TO HEPATITIS B VIRUS INFECTION (NON-IMMUNE, NOT INFECTED)";
  }

  return "";
}
