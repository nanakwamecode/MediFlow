export const LAB_REPORT_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  @page { size: A4 portrait; margin: 12mm 16mm; }
  body { font-family: 'Times New Roman', Georgia, serif; font-size: 9.5pt; color: #111; line-height: 1.38; background: #eaedf1; }
  .toolbar { position: sticky; top: 0; z-index: 1000; background: #1c1917; color: #fff; padding: 10px 20px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; font-family: 'Segoe UI', Arial, sans-serif; box-shadow: 0 2px 10px rgba(0,0,0,0.2); }
  .toolbar-title { font-size: 13px; font-weight: 700; letter-spacing: 0.02em; }
  .toolbar-actions { display: flex; gap: 8px; align-items: center; }
  .btn { border: none; border-radius: 7px; padding: 8px 16px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Segoe UI', Arial, sans-serif; }
  .btn-primary { background: #c8392b; color: #fff; }
  .btn-primary:hover { background: #a82e22; }
  .btn-secondary { background: #332e2a; color: #f5f5f4; border: 1px solid #57534e; }
  .btn-secondary:hover { background: #44403c; }
  .config-drawer { display: none; background: #faf8f5; border-bottom: 1px solid #d6d3d1; padding: 14px 20px; font-family: 'Segoe UI', Arial, sans-serif; }
  .config-drawer.open { display: block; }
  .config-grid { max-width: 210mm; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .config-field label { display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; color: #57534e; margin-bottom: 3px; }
  .config-field input { width: 100%; padding: 6px 8px; border: 1px solid #d6d3d1; border-radius: 6px; font-size: 12px; color: #111; background: #fff; }
  .config-footer { max-width: 210mm; margin: 10px auto 0; display: flex; justify-content: flex-end; gap: 8px; }
  .report-page { width: 210mm; min-height: 297mm; margin: 20px auto; padding: 13mm 16mm 11mm; background: #fff; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12); display: flex; flex-direction: column; }
  .letterhead { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; border-bottom: 1.5px solid #111; padding-bottom: 4px; margin-bottom: 6px; }
  .facility-name { font-family: Georgia, 'Times New Roman', serif; font-size: 15.5pt; font-weight: 700; letter-spacing: 0.02em; color: #111; text-transform: uppercase; }
  .facility-seal { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #9b1c1c; background: #fdf6f5; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 24px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 8pt; color: #111; margin-bottom: 10px; }
  .contact-item { display: flex; gap: 6px; }
  .contact-label { font-weight: 700; min-width: 56px; }
  .contact-val { font-weight: 600; }
  .report-banner { text-align: center; margin: 4px 0 10px; }
  .report-banner span { font-family: Georgia, 'Times New Roman', serif; font-size: 12pt; font-weight: 700; color: #9b1c1c; text-transform: uppercase; text-decoration: underline; text-underline-offset: 3px; letter-spacing: 0.04em; }
  .patient-meta { display: grid; grid-template-columns: 1.3fr 1fr 1.15fr; gap: 3px 14px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 8.2pt; margin-bottom: 14px; }
  .meta-row { display: flex; gap: 6px; align-items: baseline; }
  .meta-lbl { font-weight: 700; color: #111; white-space: nowrap; }
  .meta-val { font-weight: 600; color: #111; }
  .investigation-section { margin-bottom: 16px; }
  .investigation-section:last-child { margin-bottom: 4px; }
  .investigation-bar { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-bottom: 6px; break-after: avoid; page-break-after: avoid; }
  .investigation-title { font-family: 'Segoe UI', Arial, sans-serif; font-size: 9pt; font-weight: 700; text-transform: uppercase; text-decoration: underline; text-underline-offset: 2px; color: #111; }
  .investigation-meta { font-family: 'Segoe UI', Arial, sans-serif; font-size: 7.5pt; font-weight: 600; color: #555; white-space: nowrap; }
  table.results-table { width: 100%; border-collapse: collapse; font-family: 'Times New Roman', Georgia, serif; font-size: 9pt; margin-bottom: 10px; }
  table.results-table thead { display: table-header-group; }
  table.results-table tr { break-inside: avoid; page-break-inside: avoid; }
  table.results-table thead th { text-align: left; font-family: 'Segoe UI', Arial, sans-serif; font-size: 8pt; font-weight: 700; text-transform: uppercase; padding: 4px 6px; border-top: 1.5px solid #111; border-bottom: 1.5px solid #111; color: #111; }
  table.results-table tbody td { padding: 3.5px 6px; vertical-align: top; color: #111; }
  table.results-table tbody tr.group-row td { padding-top: 8px; padding-bottom: 3px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 8.2pt; font-weight: 700; text-transform: uppercase; text-decoration: underline; border-top: 1px solid #888; }
  table.results-table tbody tr.group-row.first-group td { border-top: none; padding-top: 5px; }
  table.results-table tbody tr.abnormal td { font-weight: 700; }
  table.results-table tbody tr.end-rule td { border-bottom: 1.5px solid #222; padding-bottom: 6px; }
  .flag-high, .flag-critical { color: #9b1c1c; font-weight: 700; }
  .flag-low { color: #1e40af; font-weight: 700; }
  .flag-normal { color: #111; }
  table.ckd-table { width: 100%; border-collapse: collapse; margin: 10px 0 12px; font-size: 8pt; break-inside: avoid; page-break-inside: avoid; }
  table.ckd-table th, table.ckd-table td { border: 1px solid #222; padding: 3.5px 6px; text-align: left; vertical-align: top; }
  table.ckd-table th { font-family: 'Segoe UI', Arial, sans-serif; font-size: 7.5pt; font-weight: 700; text-transform: uppercase; background: #fafafa; }
  .double-rule { border-top: 1px solid #222; border-bottom: 1px solid #222; height: 3px; margin: 8px 0 10px; }
  .remarks-box { margin: 8px 0 10px; padding: 6px 10px; border-left: 3px solid #9b1c1c; background: #faf8f6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 8.5pt; break-inside: avoid; page-break-inside: avoid; }
  .remarks-label { font-weight: 700; text-transform: uppercase; font-size: 7.8pt; color: #9b1c1c; margin-bottom: 2px; }
  .text-report { border-top: 1.5px solid #111; border-bottom: 1.5px solid #111; padding: 8px 4px; margin-bottom: 10px; font-size: 9pt; line-height: 1.5; }
  .text-subheading { font-family: 'Segoe UI', Arial, sans-serif; font-weight: 700; font-size: 8.2pt; text-transform: uppercase; margin-top: 6px; text-decoration: underline; }
  .end-of-report { display: flex; align-items: center; gap: 10px; margin: 14px 0 10px; font-family: 'Times New Roman', Georgia, serif; font-size: 8.5pt; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; break-inside: avoid; page-break-inside: avoid; }
  .end-of-report::before, .end-of-report::after { content: ""; flex: 1; border-top: 1px dashed #333; }
  .bottom-section { margin-top: auto; padding-top: 10px; break-inside: avoid; page-break-inside: avoid; }
  .limitation-title { font-family: 'Segoe UI', Arial, sans-serif; font-size: 8.2pt; font-weight: 700; text-transform: uppercase; text-decoration: underline; margin-bottom: 3px; }
  .limitation-text { font-size: 8.2pt; font-weight: 700; line-height: 1.38; margin-bottom: 12px; color: #111; }
  .signature-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 16px; }
  .signed-block { font-size: 8.5pt; }
  .signed-label { font-family: 'Segoe UI', Arial, sans-serif; font-size: 8pt; font-weight: 700; text-transform: uppercase; margin-bottom: 10px; }
  .signed-name { font-weight: 700; text-transform: uppercase; font-size: 8.8pt; margin-top: 4px; }
  .stamp-box { border: 1.5px solid #1e3a8a; color: #1e3a8a; padding: 5px 10px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 7pt; font-weight: 700; text-align: center; text-transform: uppercase; line-height: 1.3; border-radius: 3px; min-width: 165px; opacity: 0.88; }
  .page-footer { border-top: 1px solid #d4d4d4; padding-top: 6px; display: flex; justify-content: space-between; font-family: 'Segoe UI', Arial, sans-serif; font-size: 7.5pt; font-weight: 700; color: #222; text-transform: uppercase; }
  @media print {
    body { background: #fff; }
    .no-print { display: none !important; }
    .report-page { width: auto; min-height: 270mm; margin: 0; padding: 0; box-shadow: none; }
  }
`;
