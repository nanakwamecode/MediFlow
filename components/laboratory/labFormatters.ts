export function formatCellularResult(
  testType: "pap" | "pbf" | "biopsy" | "electrophoresis" | "g6pd" | "coombs",
  state: Record<string, string>,
  testName: string
): string {
  if (testType === "electrophoresis") {
    return `HAEMOGLOBIN ELECTROPHORESIS\n\nPattern: ${state.pattern || "-"}\nFractions: ${state.fractions || "-"}${state.comment ? `\nInterpretation: ${state.comment}` : ""}`;
  }
  if (testType === "g6pd") {
    return `G6PD SCREENING\n\nStatus: ${state.status || "-"}${state.comment ? `\nClinical Notes: ${state.comment}` : ""}`;
  }
  if (testType === "coombs") {
    return `${testName.toUpperCase()}\n\nReaction: ${state.result || "-"}${state.comment ? `\nRemarks: ${state.comment}` : ""}`;
  }
  if (testType === "pap") {
    return `CERVICAL CYTOLOGY (PAP SMEAR REPORT)\n\nSpecimen Adequacy: ${state.adequacy || "Satisfactory"}\nGeneral Category: ${state.category || "NILM"}\nBethesda Diagnosis: ${state.interpretation || "-"}${state.findings ? `\nCytological Findings: ${state.findings}` : ""}${state.recommendation ? `\nRecommendation: ${state.recommendation}` : ""}`;
  }
  if (testType === "pbf") {
    return `PERIPHERAL BLOOD FILM (PBF)\n\nRBC Morphology: ${state.rbc || "-"}\nWBC Series: ${state.wbc || "-"}\nPlatelets: ${state.platelets || "-"}\nHaemoparasites: ${state.parasites || "-"}\n\nOVERALL IMPRESSION: ${state.impression || "-"}`;
  }
  return `${testName.toUpperCase()} REPORT\n\nSpecimen: ${state.specimen || "-"}\nGross Description:\n${state.gross || "-"}\n\nMicroscopic Examination:\n${state.micro || "-"}\n\nDIAGNOSIS:\n${state.diagnosis || "-"}`;
}
