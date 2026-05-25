export interface JobAnalysisData {
  companyUrl: string;
  linkedinUrl?: string;
  isHttps: boolean | "undefined";
  domainAge: "new" | "mid" | "old" | "undefined";
  hasNordVpnAlert: boolean | "undefined";
  linkedinBadge: "verified" | "unverified" | "login_wall" | "undefined";
  linkedinEmployees: "large" | "medium" | "boutique" | "none" | "undefined";
  hasEmployeeActivity: "organic" | "low" | "fake" | "login_wall" | "undefined";
  linkedinPageCreation: "historical" | "recent" | "undefined";
  externalFootprint: "found" | "missing" | "flagged" | "undefined";
  flaggedSourceUrls: string[];
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
