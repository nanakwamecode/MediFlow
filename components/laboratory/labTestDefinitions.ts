export const URINE_FIELDS = [
  "Appearance", "Colour", "PH", "SG", "Protein", "Nitrite", "Glucose",
  "Blood", "Ketone", "Urobillinogen", "Bilirubin", "Leukocytes",
  "Pus cells", "Epithelia cells", "RBCs", "Yeast cells", "Ova (Type)",
  "T.vaginalis", "Cast (Type)", "Crystals (Type)", "Others"
] as const;

export const RENAL_FIELDS = [
  { key: "UREA", label: "UREA", defUnit: "mmol/L", defRef: "2.10-7.10" },
  { key: "CREATININE", label: "CREATININE", defUnit: "umol/L", defRef: "53-115" },
  { key: "SERUM_GLUCOSE", label: "SERUM GLUCOSE", defUnit: "mmol/L", defRef: "3.9-12.9" },
  { key: "EGFR", label: "ESTIMATED GFR (EGFR)", defUnit: "mL/min/1.73m^2", defRef: "60-205" },
  { key: "BUN", label: "BUN", defUnit: "mmol/L", defRef: "0.1-8.5" },
  { key: "BUN_CREATININE_RATIO", label: "BUN/CREAT. RATIO", defUnit: "N/A", defRef: "2-20" }
] as const;

export const LIVER_FIELDS = [
  { key: "Total_protein", label: "Total protein", defUnit: "g/L", defRef: "53-89", group: "PROTEINS" },
  { key: "Albumin", label: "Albumin", defUnit: "g/L", defRef: "28.0-54.0", group: "PROTEINS" },
  { key: "Globulin", label: "Globulin", defUnit: "g/L", defRef: "18-38", group: "PROTEINS" },
  { key: "Total_Bilirubin", label: "Total Bilirubin", defUnit: "umol/L", defRef: "0.0-20.50", group: "BILIRUBINS" },
  { key: "Direct_Bilirubin", label: "Direct Bilirubin", defUnit: "umol/L", defRef: "0.0-4.3", group: "BILIRUBINS" },
  { key: "Indirect", label: "Indirect", defUnit: "umol/L", defRef: "0.0-15", group: "BILIRUBINS" },
  { key: "AST_GOT", label: "AST/GOT", defUnit: "IU/L", defRef: "0.0-37.0", group: "LIVER ENZYME" },
  { key: "ALT_GPT", label: "ALT/GPT", defUnit: "IU/L", defRef: "0.0-45", group: "LIVER ENZYME" },
  { key: "ALP", label: "ALP", defUnit: "IU/L", defRef: "70.0-430.0", group: "LIVER ENZYME" },
  { key: "GGT", label: "GGT", defUnit: "IU/L", defRef: "3.0-55.0", group: "LIVER ENZYME" }
] as const;

export const FBC_FIELDS = [
  { key: "WBC", label: "WBC", defUnit: "10*9/L", defRef: "3.5-9.5" },
  { key: "LYM_PCT", label: "LYM%", defUnit: "%", defRef: "20.0-50" },
  { key: "MID_PCT", label: "MID %", defUnit: "%", defRef: "3.0-10.0" },
  { key: "GRAN_PCT", label: "GRAN %", defUnit: "%", defRef: "40.0-75.0" },
  { key: "LYM_NUM", label: "LYM #", defUnit: "10*9/L", defRef: "1.1-3.2" },
  { key: "MID_NUM", label: "MID#", defUnit: "10*9/L", defRef: "0.1-0.6" },
  { key: "GRAN_NUM", label: "GRAN #", defUnit: "10*9/L", defRef: "1.8-6.3" },
  { key: "RBC", label: "RBC", defUnit: "10*9/L", defRef: "3.80-5.10" },
  { key: "HB", label: "HB", defUnit: "g/dL", defRef: "11.5-15.0" },
  { key: "HCT", label: "HCT", defUnit: "%", defRef: "35.0-45.0" },
  { key: "MCV", label: "MCV", defUnit: "fL", defRef: "82.0-99" },
  { key: "MCH", label: "MCH", defUnit: "pg", defRef: "27.0-34.0" },
  { key: "MCHC", label: "MCHC", defUnit: "g/dL", defRef: "31.6-35.4" },
  { key: "RDW_CV", label: "RDW-CV", defUnit: "%", defRef: "11.5-14.5" },
  { key: "RDW_SD", label: "RDW- SD", defUnit: "fL", defRef: "37.0-54.0" },
  { key: "PLATELET", label: "PLATELET", defUnit: "10*9/L", defRef: "125-350" },
  { key: "MPV", label: "MPV", defUnit: "fL", defRef: "7.4-10.4" },
  { key: "PCT", label: "PCT", defUnit: "%", defRef: "0.10-0.28" },
  { key: "P_LCR", label: "P-LCR", defUnit: "%", defRef: "13.0-43.0" },
  { key: "P_LCC", label: "P-LCC", defUnit: "10*9/L", defRef: "13.0-129" },
  { key: "PDW_SD", label: "PDW-SD", defUnit: "fL", defRef: "10.0-14.0" },
  { key: "PDW_CV", label: "PDW-CV", defUnit: "%", defRef: "15.0-18.0" }
] as const;

export const LIPID_FIELDS = [
  { key: "CHOL", label: "Total Cholesterol", defUnit: "mmol/L", defRef: "3.1-5.2" },
  { key: "TRIG", label: "Triglycerides", defUnit: "mmol/L", defRef: "0.4-1.7" },
  { key: "HDL", label: "HDL Cholesterol", defUnit: "mmol/L", defRef: "1.0-1.6" },
  { key: "LDL", label: "LDL Cholesterol", defUnit: "mmol/L", defRef: "1.8-3.4" },
  { key: "VLDL", label: "VLDL Cholesterol", defUnit: "mmol/L", defRef: "0.2-1.0" }
] as const;

export const TFT_FIELDS = [
  { key: "TSH", label: "TSH", defUnit: "uIU/mL", defRef: "0.27-4.20" },
  { key: "FT3", label: "Free T3 (FT3)", defUnit: "pmol/L", defRef: "3.1-6.8" },
  { key: "FT4", label: "Free T4 (FT4)", defUnit: "pmol/L", defRef: "12.0-22.0" }
] as const;

export const BMP_FIELDS = [
  { key: "NA", label: "Sodium (Na+)", defUnit: "mmol/L", defRef: "135-145" },
  { key: "K", label: "Potassium (K+)", defUnit: "mmol/L", defRef: "3.5-5.1" },
  { key: "CL", label: "Chloride (Cl-)", defUnit: "mmol/L", defRef: "98-107" },
  { key: "HCO3", label: "Bicarbonate (HCO3-)", defUnit: "mmol/L", defRef: "22-29" },
  { key: "UREA", label: "Urea", defUnit: "mmol/L", defRef: "2.5-7.1" },
  { key: "CREAT", label: "Creatinine", defUnit: "umol/L", defRef: "60-110" },
  { key: "GLUC", label: "Glucose", defUnit: "mmol/L", defRef: "3.9-6.1" }
] as const;
