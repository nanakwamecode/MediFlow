"use client";

import { formatFullDate } from "@/lib/constants";

interface RecordEvent {
  type: string;
  time: string;
  ptId: string;
  ptName: string;
  detail: string;
  detail2?: string;
}

interface Props {
  events: RecordEvent[];
  period: string;
}

export function exportRecordsPdf({ events, period }: Props) {
  if (events.length === 0) {
    alert("No records to export.");
    return;
  }

  const typeColors: Record<string, { bg: string; color: string; border: string }> = {
    Vitals: { bg: "#fce8e6", color: "#c8392b", border: "#f5c6cb" },
    Consultation: { bg: "#e8f4fd", color: "#2b78c8", border: "#b8daff" },
    Lab: { bg: "#fef3c7", color: "#d97706", border: "#ffeeba" },
    Prescription: { bg: "#e6f4ea", color: "#1e8e3e", border: "#c3e6cb" },
  };

  const rows = events
    .map((e) => {
      const colors = typeColors[e.type] || { bg: "#f5f5f5", color: "#666", border: "#ddd" };
      return `
      <tr>
        <td class="time-col">${formatFullDate(e.time)}</td>
        <td class="type-col">
          <span class="type-badge" style="background: ${colors.bg}; color: ${colors.color}; border: 1px solid ${colors.border}">
            ${e.type}
          </span>
        </td>
        <td class="patient-col font-bold">${e.ptName}</td>
        <td class="detail-col">
          <div>${e.detail}</div>
          ${e.detail2 ? `<div class="detail2">${e.detail2}</div>` : ""}
        </td>
      </tr>
    `;
    })
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Records Export — MediFlow</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        @page {
          size: A4 landscape;
          margin: 15mm;
        }

        body {
          font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
          font-size: 10pt;
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

        .meta-info {
          display: flex;
          justify-content: space-between;
          background: #f8f8f8;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 10pt;
        }

        .meta-info .group {
          display: flex;
          flex-direction: column;
        }

        .meta-info .label {
          font-size: 7pt;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #888;
          font-family: 'Courier New', monospace;
        }

        .meta-info .value {
          font-weight: 600;
          color: #1a1a1a;
          text-transform: capitalize;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        th, td {
          border: 1px solid #e0e0e0;
          padding: 8px 12px;
          text-align: left;
          vertical-align: top;
        }

        th {
          background: #f5f5f5;
          font-size: 8pt;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #555;
          font-family: 'Courier New', monospace;
        }

        .time-col { width: 15%; font-family: 'Courier New', monospace; font-size: 8.5pt; color: #555; }
        .type-col { width: 12%; }
        .patient-col { width: 20%; font-weight: 600; }
        .detail-col { width: 53%; }

        .type-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 7.5pt;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .detail2 {
          font-size: 8.5pt;
          color: #666;
          margin-top: 4px;
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
        <div class="subtitle">Clinic Management System — Records Log</div>
      </div>

      <div class="meta-info">
        <div class="group">
          <div class="label">Period</div>
          <div class="value">${period}</div>
        </div>
        <div class="group">
          <div class="label">Total Records</div>
          <div class="value">${events.length}</div>
        </div>
        <div class="group">
          <div class="label">Generated On</div>
          <div class="value">${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Type</th>
            <th>Patient</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

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
