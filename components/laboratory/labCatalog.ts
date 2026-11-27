export interface LabCategory {
  name: string;
  tests: string[];
}

export const LAB_CATEGORIES: readonly LabCategory[] = [
  {
    name: "Haematology",
    tests: [
      "Complete Blood Count (CBC)", "Hemoglobin (Hb)", "Blood Group & Rh",
      "Sickling Test", "Haemoglobin Electrophoresis", "ESR (Erythrocyte Sedimentation Rate)",
      "Peripheral Blood Film (PBF)", "Reticulocyte Count",
      "Coagulation Profile", "Prothrombin Time (PT / INR)", "APTT",
      "Bleeding Time & Clotting Time (BT/CT)", "D-Dimer", "Fibrinogen",
      "G6PD Screening", "Direct Coombs Test (DAT)", "Indirect Coombs Test (IAT)",
      "CD4 / CD8 Count", "Bone Marrow Aspiration / Biopsy"
    ]
  },
  {
    name: "Chemical Pathology",
    tests: [
      "Basic Metabolic Panel (BMP)", "Renal Function Tests (RFT)", "Liver Function Tests (LFT)",
      "Lipid Panel", "Serum Electrolytes", "Blood Glucose Test", "Oral Glucose Tolerance Test (OGTT)",
      "HbA1c", "Cardiac Enzymes Panel", "Troponin I", "Troponin T", "CK-MB",
      "Total Creatine Kinase (CPK)", "BNP / NT-proBNP", "Serum Amylase", "Serum Lipase",
      "Iron Studies", "Serum Ferritin", "Serum Calcium", "Serum Magnesium",
      "Serum Phosphate", "Serum Uric Acid", "C-Reactive Protein (CRP)", "hs-CRP",
      "Procalcitonin (PCT)", "Serum Lactate", "Arterial Blood Gases (ABG)",
      "Serum Total Protein & Albumin", "Serum Bilirubin (Total & Direct)",
      "Vitamin D (25-OH)", "Vitamin B12", "Serum Folate"
    ]
  },
  {
    name: "Cellular Pathology",
    tests: [
      "Pap Smear (Cervical Cytology)", "Fine Needle Aspiration Cytology (FNAC)",
      "Histopathology / Biopsy Examination", "Cerebrospinal Fluid (CSF) Analysis",
      "Pleural Fluid Analysis", "Peritoneal / Ascitic Fluid Analysis",
      "Synovial Fluid Analysis", "Pericardial Fluid Analysis",
      "Semen Analysis", "Sputum Cytology", "Urine Cytology"
    ]
  },
  {
    name: "Microbiology & Stains",
    tests: [
      "Blood Culture & Sensitivity", "Urine Culture & Sensitivity", "Stool Culture & Sensitivity",
      "Wound Swab Culture & Sensitivity", "High Vaginal Swab (HVS) Culture & Sensitivity",
      "Urethral Swab Culture & Sensitivity", "Sputum Culture & Sensitivity",
      "Ear Swab Culture & Sensitivity", "Throat Swab Culture & Sensitivity",
      "Stool Routine Examination (Microscopy)", "HVS Wet Mount / Microscopy",
      "Sputum for AFB (ZN Stain)", "GeneXpert MTB/RIF", "Gram Stain Examination",
      "Stool Occult Blood (FOBT)", "KOH Mount for Fungi", "Chlamydia Rapid Antigen"
    ]
  },
  {
    name: "Serology & Infectious",
    tests: [
      "Malaria Parasite Test", "Widal Test", "Hepatitis B Test", "Hepatitis B Profile Test",
      "Hepatitis C", "HIV Screening", "Syphilis (VDRL/RPR)", "H. Pylori Test",
      "Pregnancy Test (hCG)"
    ]
  },
  {
    name: "Endocrinology",
    tests: [
      "Thyroid Function Tests (TFT)", "Hormonal Profile", "FSH (Follicle Stimulating Hormone)",
      "LH (Luteinizing Hormone)", "Prolactin", "Progesterone", "Estradiol (E2)",
      "Testosterone", "Beta-hCG (Quantitative)", "AMH (Anti-Müllerian Hormone)",
      "Cortisol", "PSA (Prostate Specific Antigen)"
    ]
  },
  {
    name: "Diagnostic Imaging / Other",
    tests: [
      "Chest X-Ray", "ECG", "Urinalysis/Urine R/E"
    ]
  }
] as const;

export const ALL_COMMON_TESTS: string[] = Array.from(
  new Set(LAB_CATEGORIES.flatMap((c) => c.tests))
);
