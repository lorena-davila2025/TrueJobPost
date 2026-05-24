export interface JobAnalysisData {
  companyUrl: string;
  isHttps: boolean | "undefined";
  domainAge: "New" | "Mid" | "Old" | "Undefined";
  hasNordVpnAlert: boolean | "undefined";
  linkedinBadge: "verified" | "unverified" | "undefined";
  linkedinEmployees: "none" | "few" | "many" | "undefined";
  hasEmployeeActivity: boolean | "undefined";
  linkedinPageCreation: "recent" | "established" | "undefined";
  externalFootprint: "robust" | "missing" | "flagged" | "undefined";
  hasNoFrictionInterview: boolean | "undefined";
  hasFinancialRequests: boolean | "undefined";
  hasGenericEmails: boolean | "undefined";
  hasUnrealisticPay: boolean | "undefined";
  hasEasyApplyRedirect: boolean | "undefined";
  suspiciousKeywordsFound: string[];
  evidenceNotes: string;
  scamIndicators: string[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ScoreItem {
  label: string;
  impact: number; // e.g. -20, -40, or 0
  isRedFlag: boolean;
  notes: string;
}

export interface ScoreReport {
  score: number; // 0 - 100
  class: "safe" | "warning" | "danger";
  summary: string;
  breakdown: ScoreItem[];
}
