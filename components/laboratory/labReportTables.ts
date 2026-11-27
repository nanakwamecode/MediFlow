import { renderCkdTable } from "./labReportCkd";
import { escapeHtml } from "./labReportConfig";
import {
  isRenalTest,
  type KeyValueRow,
  type ParsedLabReport,
  type QuantRow,
} from "./labReportParser";

function renderQuantTable(rows: QuantRow[]): string {
  const hasGroups = rows.some((r) => Boolean(r.group));
  let prevGroup = "";
  let seenFirstGroup = false;

  const bodyHtml = rows
    .map((row, idx) => {
      let groupHtml = "";
      if (hasGroups && row.group && row.group !== prevGroup) {
        const cls = seenFirstGroup ? "group-row" : "group-row first-group";
        groupHtml = `<tr class="${cls}"><td colspan="5">${escapeHtml(row.group)}</td></tr>`;
        prevGroup = row.group;
        seenFirstGroup = true;
      }

      const upperFlag = row.flag.toUpperCase();
      const isAbnormal = upperFlag !== "NORMAL" && upperFlag !== "";
      const flagClass =
        upperFlag === "CRITICAL"
          ? "flag-critical"
          : upperFlag === "HIGH"
            ? "flag-high"
            : upperFlag === "LOW"
              ? "flag-low"
              : "flag-normal";
      const isLast = idx === rows.length - 1;
      const rowCls = [isAbnormal ? "abnormal" : "", isLast ? "end-rule" : ""]
        .filter(Boolean)
        .join(" ");

      return `${groupHtml}<tr class="${rowCls}">
        <td>${escapeHtml(row.label)}</td>
        <td>${escapeHtml(row.value)}</td>
        <td class="${flagClass}">${escapeHtml(row.flag)}</td>
        <td>${escapeHtml(row.unit)}</td>
        <td>${escapeHtml(row.refRange)}</td>
      </tr>`;
    })
    .join("");

  return `
    <table class="results-table">
      <thead>
        <tr>
          <th style="width:36%">TEST</th>
          <th style="width:20%">RESULT OBSERVED</th>
          <th style="width:12%">FLAG</th>
          <th style="width:14%">UNIT</th>
          <th style="width:18%">REFERENCE RANGE</th>
        </tr>
      </thead>
      <tbody>${bodyHtml}</tbody>
    </table>
  `;
}

function renderKeyValueTable(rows: KeyValueRow[], title?: string): string {
  const titleHtml = title
    ? `<tr class="group-row first-group"><td colspan="3">${escapeHtml(title)}</td></tr>`
    : "";
  const bodyHtml = rows
    .map((row, idx) => {
      const isLast = idx === rows.length - 1;
      const isPositive = row.flag === "POSITIVE";
      const rowCls = [isPositive ? "abnormal" : "", isLast ? "end-rule" : ""]
        .filter(Boolean)
        .join(" ");
      const flagHtml = row.flag
        ? `<td class="${isPositive ? "flag-high" : "flag-normal"}">${escapeHtml(row.flag)}</td>`
        : "<td>—</td>";

      return `<tr class="${rowCls}">
        <td>${escapeHtml(row.label)}</td>
        <td>${escapeHtml(row.value)}</td>
        ${flagHtml}
      </tr>`;
    })
    .join("");

  return `
    <table class="results-table">
      <thead>
        <tr>
          <th style="width:42%">TEST / PARAMETER</th>
          <th style="width:40%">RESULT OBSERVED</th>
          <th style="width:18%">FLAG</th>
        </tr>
      </thead>
      <tbody>${titleHtml}${bodyHtml}</tbody>
    </table>
  `;
}

export function renderParsedBody(
  parsed: ParsedLabReport,
  testName: string
): string {
  let body = "";
  if (parsed.kind === "quant") {
    body = renderQuantTable(parsed.rows);
    if (isRenalTest(testName, parsed.rows)) {
      body += renderCkdTable();
    }
  } else if (parsed.kind === "culture") {
    body = renderKeyValueTable(parsed.summary, "FINAL CULTURE TEST REPORT");
    if (parsed.antibiogram.length > 0) {
      const abRows = parsed.antibiogram
        .map((a, idx) => {
          const isLast = idx === parsed.antibiogram.length - 1;
          const isR = a.sensitivity === "R";
          const cls = [isR ? "abnormal" : "", isLast ? "end-rule" : ""]
            .filter(Boolean)
            .join(" ");
          return `<tr class="${cls}">
            <td>${escapeHtml(a.agent)}</td>
            <td class="${isR ? "flag-high" : "flag-normal"}">${a.sensitivity === "S" ? "Susceptible (S)" : "Resistant (R)"}</td>
            <td>${a.sensitivity}</td>
          </tr>`;
        })
        .join("");
      const subTitle = parsed.isolateTitle
        ? `ANTIBIOGRAM REPORT (${parsed.isolateTitle})`
        : "ANTIBIOGRAM REPORT";
      body += `
        <table class="results-table">
          <thead><tr><th style="width:50%">ANTIMICROBIAL AGENT (${escapeHtml(subTitle)})</th><th style="width:32%">SENSITIVITY</th><th style="width:18%">CODE</th></tr></thead>
          <tbody>${abRows}</tbody>
        </table>`;
    }
  } else if (parsed.kind === "keyValue") {
    body = renderKeyValueTable(parsed.rows, parsed.title);
  } else {
    const linesHtml = parsed.lines
      .map((line) =>
        line.endsWith(":")
          ? `<div class="text-subheading">${escapeHtml(line)}</div>`
          : `<div>${escapeHtml(line)}</div>`
      )
      .join("");
    body = `<div class="text-report">${linesHtml}</div>`;
  }

  if (parsed.remarks) {
    body += `
      <div class="remarks-box">
        <div class="remarks-label">Clinical Remarks / Comment</div>
        <div>${escapeHtml(parsed.remarks)}</div>
      </div>`;
  }
  return body;
}
