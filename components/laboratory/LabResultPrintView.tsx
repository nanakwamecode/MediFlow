"use client";

import {
  escapeHtml,
  loadLabReportConfig,
  renderHeaderConfigScript,
  renderHeaderCustomizeControls,
} from "./labReportConfig";
import {
  getActiveSignatoryFallback,
  renderReportPage,
  type LabReportPatientInfo,
  type LabResultForPrint,
} from "./labReportRenderer";
import { LAB_REPORT_CSS } from "./labReportStyles";

export type { LabResultForPrint };

interface Props extends LabReportPatientInfo {
  labs: LabResultForPrint[];
}

export function exportLabResultsPdf({
  patientName,
  patientAge,
  patientGender,
  patientOpdNumber,
  signedBy,
  labs,
}: Props) {
  const completedLabs = labs.filter((l) => l.status === "completed" && l.result);

  if (completedLabs.length === 0) {
    alert("No completed lab results to export.");
    return;
  }

  const cfg = loadLabReportConfig(getActiveSignatoryFallback(signedBy));
  const pagesHtml = completedLabs
    .map((lab, idx) =>
      renderReportPage(
        lab,
        { patientName, patientAge, patientGender, patientOpdNumber, signedBy },
        cfg,
        idx === completedLabs.length - 1
      )
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Medical Laboratory Report — ${escapeHtml(patientName)}</title>
      <style>${LAB_REPORT_CSS}</style>
    </head>
    <body>
      ${renderHeaderCustomizeControls(cfg)}
      ${pagesHtml}
      ${renderHeaderConfigScript()}
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to export PDF.");
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
}

export function exportSingleLabResultPdf({
  patientName,
  patientAge,
  patientGender,
  patientOpdNumber,
  signedBy,
  lab,
}: Omit<Props, "labs"> & { lab: LabResultForPrint }) {
  exportLabResultsPdf({
    patientName,
    patientAge,
    patientGender,
    patientOpdNumber,
    signedBy,
    labs: [lab],
  });
}
