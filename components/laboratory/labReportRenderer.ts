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

const STETHOSCOPE_SEAL_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9b1c1c" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 3v4" />
    <path d="M18 3v4" />
    <circle cx="6" cy="8" r="1" fill="#9b1c1c" stroke="none" />
    <circle cx="18" cy="8" r="1" fill="#9b1c1c" stroke="none" />
    <path d="M6 8c0 4-4 5-4 9a5 5 0 0 0 10 0" />
    <path d="M18 8c0 4 4 5 4 9a5 5 0 0 1-10 0" />
    <circle cx="12" cy="17" r="2.5" />
    <circle cx="12" cy="17" r="1" fill="#9b1c1c" stroke="none" />
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

export function renderReportPage(
  lab: LabResultForPrint,
  patient: LabReportPatientInfo,
  cfg: LabReportHeaderConfig,
  isLastPage: boolean
): string {
  const parsed = parseLabResult(lab.result, lab.testName);
  const labNo = lab.id ? String(lab.id).padStart(3, "0") : "—";
  const regDate = formatReportDate(lab.timeRequested);
  const repDate = formatReportDate(lab.timeCompleted || lab.timeRequested);
  const doctorRef = lab.requestedBy?.trim()
    ? lab.requestedBy.trim().toUpperCase()
    : "NOT AVAILABLE";

  return `
    <section class="report-page">
      <header>
        <div class="letterhead">
          <div class="facility-name" data-cfg="facilityName">${escapeHtml(cfg.facilityName)}</div>
          <div class="facility-seal">${STETHOSCOPE_SEAL_SVG}</div>
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

      <div class="investigation-bar">
        <div class="investigation-title">INVESTIGATION: ${escapeHtml(lab.testName.toUpperCase())}</div>
      </div>

      <main>${renderParsedBody(parsed, lab.testName)}</main>

      ${isLastPage ? `<div class="end-of-report">END OF REPORT</div>` : ""}

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
