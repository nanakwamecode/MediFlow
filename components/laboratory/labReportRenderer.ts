import { useAuthStore } from "@/store/authStore";
import { REPORT_LIMITATION_TEXT } from "./labReportCkd";
import { escapeHtml, type LabReportHeaderConfig } from "./labReportConfig";
import { parseLabResult } from "./labReportParser";
import { renderParsedBody } from "./labReportTables";

export interface LabResultForPrint {
  id?: number;
  testName: string;
  result: string;
  timeRequested: string;
  timeCompleted?: string;
  requestedBy: string;
  status: string;
}

export interface LabReportPatientInfo {
  patientName: string;
  patientAge?: string;
  patientGender?: string;
  patientOpdNumber?: string;
  signedBy?: string;
}

const MEDIFLOW_SEAL_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 40 40" fill="none">
    <rect x="18.7" y="9.4" width="2.6" height="6.8" rx="1.2" fill="#9b1c1c" />
    <rect x="16.6" y="11.5" width="6.8" height="2.6" rx="1.2" fill="#9b1c1c" />
    <path d="M9.5 28.7 V21.2 C9.5 17.7, 14.8 17.7, 16.8 21.7 L20 27.7 L23.2 21.7 C25.2 17.7, 30.5 17.7, 30.5 21.2 V28.7" stroke="#9b1c1c" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

function formatReportDate(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  if (isNaN(d.getTime())) return new Date().toLocaleDateString("en-GB");
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateSpan(isos: (string | undefined)[]): string {
  const valid = isos
    .filter((v): v is string => Boolean(v))
    .map((v) => ({ ms: new Date(v).getTime(), label: formatReportDate(v) }))
    .filter((x) => !isNaN(x.ms))
    .sort((a, b) => a.ms - b.ms);
  if (valid.length === 0) return formatReportDate();
  const first = valid[0].label;
  const last = valid[valid.length - 1].label;
  return first === last ? first : `${first} – ${last}`;
}

function formatAgeLabel(age?: string): string {
  if (!age?.trim()) return "—";
  const clean = age.trim();
  return /^\d+$/.test(clean) ? `${clean} YEARS` : clean.toUpperCase();
}

export function getActiveSignatoryFallback(explicit?: string): string {
  if (explicit?.trim()) return explicit.trim();
  try {
    return useAuthStore.getState().user?.displayName || "";
  } catch {
    return "";
  }
}

export function renderCombinedReport(
  labs: LabResultForPrint[],
  patient: LabReportPatientInfo,
  cfg: LabReportHeaderConfig
): string {
  const labIds = Array.from(
    new Set(labs.map((l) => (l.id ? String(l.id).padStart(3, "0") : "")).filter(Boolean))
  );
  const labNo = labIds.length > 0 ? labIds.join(", ") : "—";

  const doctors = Array.from(
    new Set(labs.map((l) => l.requestedBy?.trim().toUpperCase()).filter(Boolean))
  );
  const doctorRef = doctors.length > 0 ? doctors.join(", ") : "NOT AVAILABLE";

  const regDate = formatDateSpan(labs.map((l) => l.timeRequested));
  const repDate = formatDateSpan(labs.map((l) => l.timeCompleted || l.timeRequested));
  const isMulti = labs.length > 1;

  const sectionsHtml = labs
    .map((lab) => {
      const parsed = parseLabResult(lab.result, lab.testName);
      const itemLabNo = lab.id ? String(lab.id).padStart(3, "0") : "";
      const itemDate = formatReportDate(lab.timeCompleted || lab.timeRequested);
      const metaParts = [itemLabNo ? `Lab No: ${itemLabNo}` : "", itemDate].filter(Boolean);
      const metaHtml = isMulti && metaParts.length > 0
        ? `<div class="investigation-meta">${escapeHtml(metaParts.join(" · "))}</div>`
        : "";

      return `
        <section class="investigation-section">
          <div class="investigation-bar">
            <div class="investigation-title">INVESTIGATION: ${escapeHtml(lab.testName.toUpperCase())}</div>
            ${metaHtml}
          </div>
          ${renderParsedBody(parsed, lab.testName)}
        </section>
      `;
    })
    .join("");

  return `
    <section class="report-page">
      <header>
        <div class="letterhead">
          <div class="facility-name" data-cfg="facilityName">${escapeHtml(cfg.facilityName)}</div>
          <div class="facility-seal">${MEDIFLOW_SEAL_SVG}</div>
        </div>
        <div class="contact-grid">
          <div class="contact-item"><span class="contact-label">Address:</span><span class="contact-val" data-cfg="address">${escapeHtml(cfg.address)}</span></div>
          <div class="contact-item"><span class="contact-label">Email:</span><span class="contact-val" data-cfg="email">${escapeHtml(cfg.email)}</span></div>
          <div class="contact-item"><span class="contact-label">Tel:</span><span class="contact-val" data-cfg="tel">${escapeHtml(cfg.tel)}</span></div>
          <div class="contact-item"><span class="contact-label">Website:</span><span class="contact-val" data-cfg="website">${escapeHtml(cfg.website)}</span></div>
        </div>
        <div class="report-banner"><span>MEDICAL LABORATORY REPORT</span></div>
      </header>

      <div class="patient-meta">
        <div>
          <div class="meta-row"><span class="meta-lbl">NAME:</span><span class="meta-val">${escapeHtml(patient.patientName.toUpperCase())}</span></div>
          <div class="meta-row"><span class="meta-lbl">OPD NO:</span><span class="meta-val">${escapeHtml(patient.patientOpdNumber?.trim() || "—")}</span></div>
          <div class="meta-row"><span class="meta-lbl">AGE:</span><span class="meta-val">${escapeHtml(formatAgeLabel(patient.patientAge))}</span></div>
          <div class="meta-row"><span class="meta-lbl">Gender:</span><span class="meta-val">${escapeHtml(patient.patientGender?.trim().toUpperCase() || "—")}</span></div>
        </div>
        <div>
          <div class="meta-row">&nbsp;</div>
          <div class="meta-row">&nbsp;</div>
          <div class="meta-row"><span class="meta-lbl">LAB NO:</span><span class="meta-val">${escapeHtml(labNo)}</span></div>
          <div class="meta-row"><span class="meta-lbl">DOCTOR REF:</span><span class="meta-val">${escapeHtml(doctorRef)}</span></div>
        </div>
        <div>
          <div class="meta-row">&nbsp;</div>
          <div class="meta-row"><span class="meta-lbl">REGISTRATION DATE:</span><span class="meta-val">${escapeHtml(regDate)}</span></div>
          <div class="meta-row"><span class="meta-lbl">REPORT DATE:</span><span class="meta-val">${escapeHtml(repDate)}</span></div>
        </div>
      </div>

      <main>${sectionsHtml}</main>

      <div class="end-of-report">END OF REPORT</div>

      <div class="bottom-section">
        <div class="limitation-title">LIMITATION:</div>
        <div class="limitation-text">${REPORT_LIMITATION_TEXT}</div>

        <div class="signature-row">
          <div class="signed-block">
            <div class="signed-label">SIGNED BY:</div>
            <div class="signed-name" data-cfg="signedBy">${escapeHtml(cfg.signedBy)}</div>
          </div>
          <div class="stamp-box">
            <div data-cfg="signedBy">${escapeHtml(cfg.signedBy)}</div>
            <div data-cfg="rank">${escapeHtml(cfg.rank)}</div>
            <div data-cfg="facilityName">${escapeHtml(cfg.facilityName)}</div>
          </div>
        </div>

        <footer class="page-footer">
          <div>MEMBERSHIP: <span data-cfg="membership">${escapeHtml(cfg.membership)}</span></div>
          <div>RANK: <span data-cfg="rank">${escapeHtml(cfg.rank)}</span></div>
        </footer>
      </div>
    </section>
  `;
}
