/**
 * Default units and reference ranges for quantitative clinical laboratory tests.
 */
export function getDefaultTestRef(testName: string): { unit: string; ref: string } | null {
  const n = testName.toLowerCase();

  // Exclude full panels that have multi-field editors
  if (
    n.includes("blood glucose test") ||
    n.includes("hormonal profile") ||
    n.includes("coagulation profile") ||
    n.includes("cardiac enzymes panel") ||
    n.includes("iron studies") ||
    n.includes("serum electrolytes") ||
    n.includes("arterial blood gases") ||
    n.includes("semen analysis") ||
    n.includes("csf analysis")
  ) {
    return null;
  }

  // Haematology
  if (n.includes("hba1c")) return { unit: "%", ref: "4.0-5.6" };
  if (n.includes("esr")) return { unit: "mm/hr", ref: "0-20" };
  if (n.includes("reticulocyte")) return { unit: "%", ref: "0.5-2.5" };
  if (n.includes("cd4")) return { unit: "cells/uL", ref: "500-1500" };
  if (n.includes("d-dimer") || n.includes("d dimer")) return { unit: "ug/mL", ref: "< 0.50" };
  if (n.includes("fibrinogen")) return { unit: "g/L", ref: "2.0-4.0" };
  if (n.includes("prothrombin") || n.includes("pt / inr") || n.includes("pt/inr")) return { unit: "sec", ref: "11.0-14.0" };
  if (n === "inr") return { unit: "ratio", ref: "0.8-1.2" };
  if (n === "aptt" || n.includes("partial thromboplastin")) return { unit: "sec", ref: "25.0-38.0" };
  if (n.includes("bleeding time")) return { unit: "min", ref: "2.0-7.0" };
  if (n.includes("clotting time")) return { unit: "min", ref: "4.0-10.0" };
  if (n.includes("hemoglobin") || n.includes("haemoglobin") || n.includes("hb estimate") || n === "hb") {
    return { unit: "g/dL", ref: "11.5-15.0" };
  }

  // Chemical Pathology / Cardiac / Enzymes
  if (n.includes("troponin i")) return { unit: "ng/mL", ref: "< 0.04" };
  if (n.includes("troponin t")) return { unit: "ng/mL", ref: "< 0.01" };
  if (n.includes("ck-mb") || n.includes("ckmb")) return { unit: "U/L", ref: "0.0-25.0" };
  if (n.includes("creatine kinase") || n.includes("cpk") || n === "total ck") return { unit: "U/L", ref: "24-195" };
  if (n.includes("bnp") || n.includes("nt-probnp")) return { unit: "pg/mL", ref: "< 100" };
  if (n.includes("amylase")) return { unit: "U/L", ref: "28-100" };
  if (n.includes("lipase")) return { unit: "U/L", ref: "13-60" };
  if (n.includes("uric acid")) return { unit: "umol/L", ref: "200-430" };
  if (n.includes("calcium")) return { unit: "mmol/L", ref: "2.15-2.55" };
  if (n.includes("magnesium")) return { unit: "mmol/L", ref: "0.70-1.05" };
  if (n.includes("phosphate") || n.includes("phosphorus")) return { unit: "mmol/L", ref: "0.80-1.45" };
  if (n.includes("ferritin")) return { unit: "ng/mL", ref: "15-300" };
  if (n.includes("serum iron")) return { unit: "umol/L", ref: "11.0-30.0" };
  if (n.includes("tibc")) return { unit: "umol/L", ref: "45-72" };
  if (n.includes("hs-crp")) return { unit: "mg/L", ref: "< 1.0" };
  if (n.includes("crp") || n.includes("c-reactive")) return { unit: "mg/L", ref: "< 5.0" };
  if (n.includes("procalcitonin") || n === "pct") return { unit: "ng/mL", ref: "< 0.10" };
  if (n.includes("lactate") || n.includes("lactic acid")) return { unit: "mmol/L", ref: "0.5-2.2" };
  if (n.includes("vitamin d")) return { unit: "ng/mL", ref: "30-100" };
  if (n.includes("vitamin b12") || n.includes("b12")) return { unit: "pg/mL", ref: "200-900" };
  if (n.includes("folate") || n.includes("folic acid")) return { unit: "ng/mL", ref: "3.0-20.0" };
  if (n.includes("albumin") && !n.includes("liver") && !n.includes("urine")) return { unit: "g/L", ref: "35-50" };

  // Endocrinology
  if (n.includes("psa")) return { unit: "ng/mL", ref: "< 4.0" };
  if (n.includes("fsh")) return { unit: "mIU/mL", ref: "1.5-12.4" };
  if (n.includes("lh") && !n.includes("electrolytes")) return { unit: "mIU/mL", ref: "1.7-8.6" };
  if (n.includes("prolactin")) return { unit: "ng/mL", ref: "4.8-23.3" };
  if (n.includes("progesterone")) return { unit: "ng/mL", ref: "0.2-25.0" };
  if (n.includes("estradiol") || n.includes("e2")) return { unit: "pg/mL", ref: "12.5-166.0" };
  if (n.includes("testosterone")) return { unit: "nmol/L", ref: "8.4-28.7" };
  if (n.includes("cortisol")) return { unit: "ug/dL", ref: "6.0-18.4" };
  if (n.includes("beta-hcg") || n.includes("beta hcg")) return { unit: "mIU/mL", ref: "< 5.0" };
  if (n.includes("amh")) return { unit: "ng/mL", ref: "1.0-4.0" };

  return null;
}
