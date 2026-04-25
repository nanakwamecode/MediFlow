"use client";

import { formatFullDate } from "@/lib/constants";

interface LabResultForPrint {
  testName: string;
  result: string;
  timeRequested: string;
  timeCompleted?: string;
  requestedBy: string;
  status: string;
}

interface Props {
  patientName: string;
  patientAge?: string;
  patientGender?: string;
  patientOpdNumber?: string;
  labs: LabResultForPrint[];
}

/** Opens a new window with print-styled content and triggers print dialog */
export function exportLabResultsPdf({
  patientName,
  patientAge,
  patientGender,
  patientOpdNumber,
  labs,
}: Props) {
  const completedLabs = labs.filter(
    (l) => l.status === "completed" && l.result
  );

  if (completedLabs.length === 0) {
    alert("No completed lab results to export.");
    return;
  }

  const labRows = completedLabs
    .map(
      (lab) => `
      <div class="lab-result">
        <div class="lab-header">
          <h3>${lab.testName}</h3>
          <div class="lab-meta">
            <span>Requested: ${formatFullDate(lab.timeRequested)}</span>
            ${lab.timeCompleted ? `<span>Completed: ${formatFullDate(lab.timeCompleted)}</span>` : ""}
            <span>Doctor: ${lab.requestedBy}</span>
          </div>
        </div>
        <div class="lab-body">
          <pre>${lab.result}</pre>
        </div>
      </div>
    `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab Results — ${patientName}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        @page {
          size: A4;
          margin: 15mm 20mm;
        }

        body {
          font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
          font-size: 11pt;
          color: #1a1a1a;
          line-height: 1.5;
          background: #fff;
        }

        .header {
          text-align: center;
          border-bottom: 2px solid #c8392b;
          padding-bottom: 12px;
          margin-bottom: 20px;
        }

        .header h1 {
          font-size: 22pt;
          font-style: italic;
          color: #c8392b;
          font-family: Georgia, 'Times New Roman', serif;
          letter-spacing: 0.02em;
        }

        .header .subtitle {
          font-size: 8pt;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #666;
          margin-top: 3px;
          font-family: 'Courier New', monospace;
        }

        .patient-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 24px;
          background: #f8f8f8;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 10pt;
        }

        .patient-info .label {
          font-size: 7pt;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #888;
          font-family: 'Courier New', monospace;
        }

        .patient-info .value {
          font-weight: 600;
          color: #1a1a1a;
        }

        .report-title {
          font-size: 13pt;
          font-weight: 700;
          margin-bottom: 16px;
          color: #333;
          border-bottom: 1px solid #ddd;
          padding-bottom: 6px;
        }

        .lab-result {
          margin-bottom: 18px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          overflow: hidden;
          page-break-inside: avoid;
        }

        .lab-header {
          background: #f5f5f5;
          padding: 10px 14px;
          border-bottom: 1px solid #e0e0e0;
        }

        .lab-header h3 {
          font-size: 11pt;
          font-weight: 700;
          color: #c8392b;
          margin-bottom: 4px;
        }

        .lab-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 7.5pt;
          font-family: 'Courier New', monospace;
          color: #777;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .lab-body {
          padding: 12px 14px;
        }

        .lab-body pre {
          font-family: 'Courier New', monospace;
          font-size: 9.5pt;
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.6;
          color: #333;
        }

        .footer {
          margin-top: 30px;
          padding-top: 10px;
          border-top: 1px solid #ddd;
          font-size: 7.5pt;
          font-family: 'Courier New', monospace;
          color: #999;
          text-align: center;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }

        .print-btn {
          position: fixed;
          top: 16px;
          right: 16px;
          background: #c8392b;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 24px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .print-btn:hover { background: #a82e23; }
      </style>
    </head>
    <body>
      <button class="print-btn no-print" onclick="window.print()">
        Save as PDF / Print
      </button>

      <div class="header">
        <h1>MediFlow</h1>
        <div class="subtitle">Clinic Management System — Laboratory Report</div>
      </div>

      <div class="patient-info">
        <div>
          <div class="label">Patient Name</div>
          <div class="value">${patientName}</div>
        </div>
        ${patientOpdNumber ? `<div><div class="label">OPD Number</div><div class="value">${patientOpdNumber}</div></div>` : ""}
        ${patientAge ? `<div><div class="label">Age</div><div class="value">${patientAge}</div></div>` : ""}
        ${patientGender ? `<div><div class="label">Gender</div><div class="value">${patientGender}</div></div>` : ""}
        <div>
          <div class="label">Report Date</div>
          <div class="value">${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
        </div>
        <div>
          <div class="label">Total Results</div>
          <div class="value">${completedLabs.length}</div>
        </div>
      </div>

      <div class="report-title">Laboratory Investigation Results</div>

      ${labRows}

      <div class="footer">
        Generated by MediFlow · ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} at ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
      </div>
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

/** Export a single lab result as PDF */
export function exportSingleLabResultPdf({
  patientName,
  patientAge,
  patientGender,
  patientOpdNumber,
  lab,
}: Omit<Props, "labs"> & { lab: LabResultForPrint }) {
  exportLabResultsPdf({
    patientName,
    patientAge,
    patientGender,
    patientOpdNumber,
    labs: [lab],
  });
}
