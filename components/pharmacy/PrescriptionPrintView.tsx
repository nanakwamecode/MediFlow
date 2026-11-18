"use client";

import { formatFullDate } from "@/lib/constants";

interface PrescriptionForPrint {
  medication: string;
  dosage: string;
  instructions: string;
  timePrescribed: string;
  timeDispensed?: string | null;
  prescribedBy: string;
  status: string;
}

interface Props {
  patientName: string;
  patientAge?: string;
  patientGender?: string;
  patientOpdNumber?: string;
  prescriptions: PrescriptionForPrint[];
}

export function exportPrescriptionsPdf({
  patientName,
  patientAge,
  patientGender,
  patientOpdNumber,
  prescriptions,
}: Props) {
  if (prescriptions.length === 0) {
    alert("No prescriptions to export.");
    return;
  }

  const rows = prescriptions
    .map(
      (rx, idx) => `
      <div class="rx-row">
        <div class="rx-num">${idx + 1}</div>
        <div class="rx-details">
          <div class="rx-name">${rx.medication} <span class="rx-dosage">(${rx.dosage})</span></div>
          <div class="rx-inst">Sig: ${rx.instructions}</div>
          <div class="rx-meta">
            Prescribed by ${rx.prescribedBy} on ${formatFullDate(rx.timePrescribed)}
            ${rx.timeDispensed ? ` · Dispensed on ${formatFullDate(rx.timeDispensed)}` : " · (Pending Dispense)"}
          </div>
        </div>
      </div>
    `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Prescriptions — ${patientName}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4; margin: 15mm 20mm; }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
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
          color: #c8392b;
          font-family: Georgia, serif;
        }
        .header .subtitle {
          font-size: 8.5pt;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #666;
          margin-top: 3px;
        }
        .patient-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 24px;
          background: #f8f8f8;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 10pt;
        }
        .patient-info .label {
          font-size: 7.5pt;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #777;
          font-weight: bold;
        }
        .patient-info .value {
          font-weight: 700;
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
        .rx-row {
          display: flex;
          gap: 14px;
          margin-bottom: 14px;
          padding: 12px;
          border: 1px solid #e2e2e2;
          border-radius: 8px;
          page-break-inside: avoid;
        }
        .rx-num {
          font-size: 14pt;
          font-weight: bold;
          color: #c8392b;
          width: 24px;
        }
        .rx-details { flex: 1; }
        .rx-name { font-size: 12pt; font-weight: bold; color: #1a1a1a; }
        .rx-dosage { color: #555; font-size: 10.5pt; font-weight: normal; }
        .rx-inst { font-style: italic; color: #333; margin: 4px 0; font-size: 10.5pt; }
        .rx-meta { font-size: 8.5pt; color: #777; font-family: monospace; }
        .footer {
          margin-top: 30px;
          padding-top: 10px;
          border-top: 1px solid #ddd;
          font-size: 8pt;
          color: #999;
          text-align: center;
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
        }
      </style>
    </head>
    <body>
      <button class="print-btn no-print" onclick="window.print()">
        Save as PDF / Print
      </button>
      <div class="header">
        <h1>MediFlow</h1>
        <div class="subtitle">Clinic Management System — Prescription Order</div>
      </div>
      <div class="patient-info">
        <div><div class="label">Patient Name</div><div class="value">${patientName}</div></div>
        ${patientOpdNumber ? `<div><div class="label">OPD Number</div><div class="value">${patientOpdNumber}</div></div>` : ""}
        ${patientAge ? `<div><div class="label">Age</div><div class="value">${patientAge}</div></div>` : ""}
        ${patientGender ? `<div><div class="label">Gender</div><div class="value">${patientGender}</div></div>` : ""}
      </div>
      <div class="report-title">Prescription Items (${prescriptions.length})</div>
      ${rows}
      <div class="footer">
        Generated by MediFlow · ${new Date().toLocaleDateString("en-GB")}
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
