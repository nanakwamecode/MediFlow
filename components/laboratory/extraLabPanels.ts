import {
  RENAL_FIELDS, LIVER_FIELDS, FBC_FIELDS, LIPID_FIELDS,
  TFT_FIELDS, BMP_FIELDS, BLOOD_GLUCOSE_FIELDS, HORMONAL_PROFILE_FIELDS
} from "./labTestDefinitions";

export const COAGULATION_FIELDS = [
  { key: "PT", label: "Prothrombin Time (PT)", defUnit: "sec", defRef: "11.0-14.0" },
  { key: "INR", label: "INR", defUnit: "ratio", defRef: "0.8-1.2" },
  { key: "APTT", label: "APTT", defUnit: "sec", defRef: "25.0-38.0" },
  { key: "FIBRINOGEN", label: "Fibrinogen", defUnit: "g/L", defRef: "2.0-4.0" },
  { key: "D_DIMER", label: "D-Dimer", defUnit: "ug/mL", defRef: "< 0.50" },
] as const;

export const CARDIAC_FIELDS = [
  { key: "TROP_I", label: "Cardiac Troponin I", defUnit: "ng/mL", defRef: "< 0.04" },
  { key: "CK_MB", label: "CK-MB", defUnit: "U/L", defRef: "0.0-25.0" },
  { key: "TOTAL_CK", label: "Total Creatine Kinase (CPK)", defUnit: "U/L", defRef: "24-195" },
  { key: "BNP", label: "BNP", defUnit: "pg/mL", defRef: "< 100" },
] as const;

export const IRON_PROFILE_FIELDS = [
  { key: "SERUM_IRON", label: "Serum Iron", defUnit: "umol/L", defRef: "11.0-30.0" },
  { key: "FERRITIN", label: "Serum Ferritin", defUnit: "ng/mL", defRef: "15-300" },
  { key: "TIBC", label: "Total Iron Binding Capacity (TIBC)", defUnit: "umol/L", defRef: "45-72" },
  { key: "XFER_SAT", label: "Transferrin Saturation", defUnit: "%", defRef: "20-50" },
] as const;

export const ELECTROLYTE_FIELDS = [
  { key: "NA", label: "Sodium (Na+)", defUnit: "mmol/L", defRef: "135-145" },
  { key: "K", label: "Potassium (K+)", defUnit: "mmol/L", defRef: "3.5-5.1" },
  { key: "CL", label: "Chloride (Cl-)", defUnit: "mmol/L", defRef: "98-107" },
  { key: "HCO3", label: "Bicarbonate (HCO3-)", defUnit: "mmol/L", defRef: "22-29" },
] as const;

export const ABG_FIELDS = [
  { key: "PH", label: "pH", defUnit: "", defRef: "7.35-7.45" },
  { key: "PCO2", label: "pCO2", defUnit: "mmHg", defRef: "35-45" },
  { key: "PO2", label: "pO2", defUnit: "mmHg", defRef: "80-100" },
  { key: "HCO3", label: "HCO3- (Actual)", defUnit: "mmol/L", defRef: "22-26" },
  { key: "BE", label: "Base Excess (BE)", defUnit: "mmol/L", defRef: "-2 to +2" },
  { key: "SAO2", label: "Oxygen Saturation (SaO2)", defUnit: "%", defRef: "95-100" },
  { key: "LACTATE", label: "Lactate", defUnit: "mmol/L", defRef: "0.5-2.2" },
] as const;

export const CSF_FIELDS = [
  { key: "Appearance", label: "Appearance", defUnit: "", defRef: "Clear & Colourless" },
  { key: "WBC", label: "Total WBC Count", defUnit: "cells/uL", defRef: "0-5" },
  { key: "POLY", label: "Polymorphs (Neutrophils)", defUnit: "%", defRef: "0-10" },
  { key: "LYMPH", label: "Lymphocytes", defUnit: "%", defRef: "90-100" },
  { key: "PROTEIN", label: "Protein", defUnit: "g/L", defRef: "0.15-0.45" },
  { key: "GLUCOSE", label: "Glucose", defUnit: "mmol/L", defRef: "2.2-4.4" },
  { key: "GRAM", label: "Gram Stain", defUnit: "", defRef: "No organisms seen" },
] as const;

export const SEMEN_ANALYSIS_FIELDS = [
  { key: "VOLUME", label: "Volume", defUnit: "mL", defRef: ">= 1.5" },
  { key: "PH", label: "pH", defUnit: "", defRef: "7.2-8.0" },
  { key: "LIQUEFACTION", label: "Liquefaction Time", defUnit: "mins", defRef: "< 30" },
  { key: "CONCENTRATION", label: "Sperm Concentration", defUnit: "x10^6/mL", defRef: ">= 15.0" },
  { key: "TOTAL_COUNT", label: "Total Sperm Count", defUnit: "x10^6", defRef: ">= 39.0" },
  { key: "PROG_MOTILITY", label: "Progressive Motility (PR)", defUnit: "%", defRef: ">= 32" },
  { key: "TOTAL_MOTILITY", label: "Total Motility (PR+NP)", defUnit: "%", defRef: ">= 40" },
  { key: "NORMAL_MORPH", label: "Normal Morphology", defUnit: "%", defRef: ">= 4" },
  { key: "PUS_CELLS", label: "Pus Cells (WBC)", defUnit: "/HPF", defRef: "< 5" },
] as const;

export const FLUID_ANALYSIS_FIELDS = [
  { key: "Appearance", label: "Appearance", defUnit: "", defRef: "Clear / Straw" },
  { key: "TOTAL_PROTEIN", label: "Total Protein", defUnit: "g/L", defRef: "< 30 (Transudate)" },
  { key: "ALBUMIN", label: "Albumin", defUnit: "g/L", defRef: "10-25" },
  { key: "GLUCOSE", label: "Glucose", defUnit: "mmol/L", defRef: "3.5-5.5" },
  { key: "LDH", label: "LDH", defUnit: "U/L", defRef: "< 200" },
  { key: "WBC", label: "Total Cell Count", defUnit: "cells/uL", defRef: "< 1000" },
  { key: "CYTOLOGY", label: "Cytology (Malignancy)", defUnit: "", defRef: "Negative for malignant cells" },
] as const;

export type PanelFieldItem = {
  readonly key: string;
  readonly label: string;
  readonly defUnit: string;
  readonly defRef: string;
  readonly group?: string;
};

export function resolvePanelFields(name: string): readonly PanelFieldItem[] | null {
  const n = name.toLowerCase();
  if (n.includes("renal") || n.includes("kidney") || n.includes("rft")) return RENAL_FIELDS;
  if (n.includes("liver") || n.includes("lft")) return LIVER_FIELDS;
  if (n.includes("fbc") || n.includes("blood count") || n.includes("cbc")) return FBC_FIELDS;
  if (n.includes("lipid") || n.includes("cholesterol panel")) return LIPID_FIELDS;
  if (n.includes("thyroid") || n.includes("tft")) return TFT_FIELDS;
  if (n.includes("blood glucose test") || (n.includes("blood glucose") && !n.includes("fasting") && !n.includes("random"))) return BLOOD_GLUCOSE_FIELDS;
  if (n.includes("hormonal profile") || n.includes("fertility profile") || n.includes("hormone panel")) return HORMONAL_PROFILE_FIELDS;
  if (n.includes("coagulation profile")) return COAGULATION_FIELDS;
  if (n.includes("cardiac enzyme") || n.includes("cardiac panel")) return CARDIAC_FIELDS;
  if (n.includes("iron studies") || n.includes("iron profile")) return IRON_PROFILE_FIELDS;
  if (n.includes("arterial blood") || n.includes("abg")) return ABG_FIELDS;
  if (n.includes("csf") || n.includes("cerebrospinal")) return CSF_FIELDS;
  if (n.includes("semen") || n.includes("seminal")) return SEMEN_ANALYSIS_FIELDS;
  if (n.includes("pleural") || n.includes("peritoneal") || n.includes("ascitic") || n.includes("synovial") || n.includes("pericardial")) return FLUID_ANALYSIS_FIELDS;
  if (n.includes("electrolyte") && !n.includes("bmp") && !n.includes("basic metabolic")) return ELECTROLYTE_FIELDS;
  if (n.includes("basic metabolic") || n.includes("bmp")) return BMP_FIELDS;
  return null;
}
