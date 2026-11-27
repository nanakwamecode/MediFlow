export interface LabReportHeaderConfig {
  facilityName: string;
  address: string;
  tel: string;
  email: string;
  website: string;
  signedBy: string;
  rank: string;
  membership: string;
}

export const LAB_REPORT_STORAGE_KEY = "mediflow_lab_report_header";

export const DEFAULT_LAB_REPORT_CONFIG: LabReportHeaderConfig = {
  facilityName: "MEDIFLOW CLINIC — CLINICAL LABORATORY",
  address: "MediFlow Medical Center",
  tel: "—",
  email: "lab@mediflow.clinic",
  website: "www.mediflow.clinic",
  signedBy: "LABORATORY SCIENTIST",
  rank: "MEDICAL LABORATORY SCIENTIST",
  membership: "MEDIFLOW CLINIC SYSTEM",
};

export function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function loadLabReportConfig(
  fallbackSignatory?: string
): LabReportHeaderConfig {
  const base: LabReportHeaderConfig = {
    ...DEFAULT_LAB_REPORT_CONFIG,
    ...(fallbackSignatory?.trim()
      ? { signedBy: fallbackSignatory.trim().toUpperCase() }
      : {}),
  };

  if (typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(LAB_REPORT_STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<LabReportHeaderConfig>;
    return {
      facilityName: parsed.facilityName?.trim() || base.facilityName,
      address: parsed.address?.trim() || base.address,
      tel: parsed.tel?.trim() || base.tel,
      email: parsed.email?.trim() || base.email,
      website: parsed.website?.trim() || base.website,
      signedBy: parsed.signedBy?.trim() || base.signedBy,
      rank: parsed.rank?.trim() || base.rank,
      membership: parsed.membership?.trim() || base.membership,
    };
  } catch {
    return base;
  }
}

export function renderHeaderCustomizeControls(
  cfg: LabReportHeaderConfig
): string {
  const fields: { key: keyof LabReportHeaderConfig; label: string }[] = [
    { key: "facilityName", label: "Hospital / Clinic Name" },
    { key: "address", label: "Address" },
    { key: "tel", label: "Tel" },
    { key: "email", label: "Email" },
    { key: "website", label: "Website" },
    { key: "signedBy", label: "Signed By" },
    { key: "rank", label: "Rank / Title" },
    { key: "membership", label: "Membership / Reg" },
  ];

  const inputs = fields
    .map(
      (f) => `
      <div class="config-field">
        <label for="cfg-${f.key}">${f.label}</label>
        <input id="cfg-${f.key}" type="text" value="${escapeHtml(cfg[f.key])}" />
      </div>`
    )
    .join("");

  return `
    <div class="toolbar no-print">
      <div class="toolbar-title">Medical Laboratory Report Preview</div>
      <div class="toolbar-actions">
        <button type="button" class="btn btn-secondary" onclick="document.getElementById('cfgDrawer').classList.toggle('open')">
          Customize Header &amp; Signatory
        </button>
        <button type="button" class="btn btn-primary" onclick="window.print()">
          Save as PDF / Print
        </button>
      </div>
    </div>
    <div id="cfgDrawer" class="config-drawer no-print">
      <div class="config-grid">${inputs}</div>
      <div class="config-footer">
        <button type="button" class="btn btn-secondary" onclick="resetLabHeader()">Reset Defaults</button>
        <button type="button" class="btn btn-primary" onclick="applyLabHeader()">Apply &amp; Save</button>
      </div>
    </div>
  `;
}

export function renderHeaderConfigScript(): string {
  const defaultsJson = JSON.stringify(DEFAULT_LAB_REPORT_CONFIG);
  return `
    <script>
      var DEFAULT_CFG = ${defaultsJson};
      var STORAGE_KEY = ${JSON.stringify(LAB_REPORT_STORAGE_KEY)};
      function updateFieldNodes(attr, val) {
        var nodes = document.querySelectorAll('[data-cfg="' + attr + '"]');
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].textContent = val;
        }
      }
      function applyLabHeader() {
        var keys = Object.keys(DEFAULT_CFG);
        var next = {};
        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          var el = document.getElementById('cfg-' + k);
          next[k] = el && el.value.trim() ? el.value.trim() : DEFAULT_CFG[k];
          updateFieldNodes(k, next[k]);
        }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          if (window.opener && window.opener.localStorage) {
            window.opener.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          }
        } catch (e) {}
        document.getElementById('cfgDrawer').classList.remove('open');
      }
      function resetLabHeader() {
        var keys = Object.keys(DEFAULT_CFG);
        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          var el = document.getElementById('cfg-' + k);
          if (el) el.value = DEFAULT_CFG[k];
          updateFieldNodes(k, DEFAULT_CFG[k]);
        }
        try {
          localStorage.removeItem(STORAGE_KEY);
          if (window.opener && window.opener.localStorage) {
            window.opener.localStorage.removeItem(STORAGE_KEY);
          }
        } catch (e) {}
      }
    </script>
  `;
}
