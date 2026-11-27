import { escapeHtml } from "./labReportConfig";

export const REPORT_LIMITATION_TEXT =
  "As with all laboratory tests, actual clinical diagnosis should not be based on the findings of a single test, but it should be made by the physician after all laboratory and clinical findings have been evaluated.";

export interface CkdStageRow {
  stage: string;
  description: string;
  egfr: string;
  actionPlan: string;
}

export const CKD_STAGING_ROWS: readonly CkdStageRow[] = [
  {
    stage: "G1",
    description: "Kidney damage with normal or ↑GFR",
    egfr: "≥90",
    actionPlan:
      "Diagnosis and treatment, treatment of comorbid conditions, slow progression, CVD risk reduction",
  },
  {
    stage: "G2",
    description: "Kidney damage with mild ↓GFR",
    egfr: "60-89",
    actionPlan: "Estimating progression",
  },
  {
    stage: "G3",
    description: "Moderate ↓GFR",
    egfr: "30-59",
    actionPlan: "Evaluating and treating complications",
  },
  {
    stage: "G4",
    description: "Severe ↓GFR",
    egfr: "15-29",
    actionPlan: "Preparation for kidney replacement therapy",
  },
  {
    stage: "G5",
    description: "Kidney failure",
    egfr: "< 15",
    actionPlan: "Kidney replacement therapy",
  },
];

export function renderCkdTable(): string {
  const rowsHtml = CKD_STAGING_ROWS.map(
    (r) =>
      `<tr><td style="font-weight:700">${escapeHtml(r.stage)}</td><td>${escapeHtml(r.description)}</td><td style="font-weight:700">${escapeHtml(r.egfr)}</td><td>${escapeHtml(r.actionPlan)}</td></tr>`
  ).join("");

  return `
    <table class="ckd-table">
      <thead>
        <tr>
          <th style="width:8%">STAGE</th>
          <th style="width:33%">DESCRIPTION</th>
          <th style="width:10%">EGFR</th>
          <th style="width:49%">CLINICAL ACTION PLAN</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>
    <div class="double-rule"></div>
  `;
}
