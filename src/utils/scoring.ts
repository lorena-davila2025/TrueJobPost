import { JobAnalysisData, ScoreReport, ScoreItem } from "../types";

export function computeTrustScore(data: JobAnalysisData): ScoreReport {
  let score = 100;
  const breakdown: ScoreItem[] = [];

  // 1. Website/Domain HTTPS status
  let httpsImpact = 0;
  let httpsNotes = "";
  if (data.isHttps === false) {
    httpsImpact = -15;
    httpsNotes = "The company website domain does not support HTTPS encryption or redirects securely. Legitimate corporate representations possess active SSL/TLS credentials.";
  } else if (data.isHttps === "undefined") {
    httpsImpact = -5;
    httpsNotes = "Website security certificate protocol status is unverified. Approach browser navigation carefully.";
  } else {
    httpsImpact = 0;
    httpsNotes = "The website is equipped with valid secure HTTPS encryption headers.";
  }
  score += httpsImpact;
  breakdown.push({
    label: "Web SSL Security Profile Check",
    impact: httpsImpact,
    isRedFlag: data.isHttps === false,
    notes: httpsNotes
  });

  // 2. Domain Register Age status
  let domainAgeImpact = 0;
  let domainNotes = "";
  if (data.domainAge === "New") {
    domainAgeImpact = -35;
    domainNotes = "The company website domain was registered within 1 year. Recruitment scammers frequently rely on brand-new temporary domains to host copycat corporate pages.";
  } else if (data.domainAge === "Undefined") {
    domainAgeImpact = -10;
    domainNotes = "No domain registration age could be fetched. Legitimate firms maintain search ground histories.";
  } else if (data.domainAge === "Mid") {
    domainAgeImpact = -5;
    domainNotes = "Domain age is in the moderate bracket (1-5 years). Authentic early startup behavior, but requires secondary signal checks.";
  } else if (data.domainAge === "Old") {
    domainAgeImpact = 0;
    domainNotes = "Highly robust multi-year domain footprint (5+ years active). Standard Enterprise profile indicator.";
  }
  score += domainAgeImpact;
  breakdown.push({
    label: `Corporate Domain Registry Age: ${data.domainAge}`,
    impact: domainAgeImpact,
    isRedFlag: data.domainAge === "New",
    notes: domainNotes
  });

  // 3. NordVPN / Web Safety alerts
  let pvnImpact = 0;
  let vpnNotes = "";
  if (data.hasNordVpnAlert === true) {
    pvnImpact = -25;
    vpnNotes = "The domain is actively listed on web-reputation blacklists for spam, generic phishing campaigns, or active malware routing alerts.";
  } else if (data.hasNordVpnAlert === "undefined") {
    pvnImpact = -5;
    vpnNotes = "Safety reputation check came back unverified. Ensure browser protections remain active.";
  } else {
    pvnImpact = 0;
    vpnNotes = "No active domain blacklist detections or web threat registry alerts spotted.";
  }
  score += pvnImpact;
  breakdown.push({
    label: "Web Reputation & Blacklist Scan",
    impact: pvnImpact,
    isRedFlag: data.hasNordVpnAlert === true,
    notes: vpnNotes
  });

  // 4. LinkedIn Verification Badge
  let badgeImpact = 0;
  let badgeNotes = "";
  if (data.linkedinBadge === "unverified") {
    badgeImpact = -15;
    badgeNotes = "The LinkedIn corporate company profile page is unverified. Under LinkedIn guidelines, genuine enterprises authenticate their pages using official domains.";
  } else if (data.linkedinBadge === "undefined") {
    badgeImpact = -5;
    badgeNotes = "Could not track down any associated company profile on social networks.";
  } else {
    badgeImpact = 0;
    badgeNotes = "Corporate profile bears the official verification badge, certifying it matches genuine corporate registry data.";
  }
  score += badgeImpact;
  breakdown.push({
    label: "Corporate LinkedIn Badge Status",
    impact: badgeImpact,
    isRedFlag: data.linkedinBadge === "unverified",
    notes: badgeNotes
  });

  // 5. LinkedIn Employee count/presence density
  let empImpact = 0;
  let empNotes = "";
  if (data.linkedinEmployees === "none") {
    empImpact = -25;
    empNotes = "Zero linked employees exist on LinkedIn despite asserting an active corporate agency identity. Core marker of modern virtual shell scams.";
  } else if (data.linkedinEmployees === "few") {
    empImpact = -10;
    empNotes = "A very small workforce (1-5 associated profiles). If the listing states they are a leading agency/enterprise, this discrepancy is highly suspicious.";
  } else if (data.linkedinEmployees === "undefined") {
    empImpact = -5;
    empNotes = "Associated worker numbers check unverified.";
  } else {
    empImpact = 0;
    empNotes = "Satisfactory linked workforce registry profile count found.";
  }
  score += empImpact;
  breakdown.push({
    label: "Active Worker Registry",
    impact: empImpact,
    isRedFlag: data.linkedinEmployees === "none",
    notes: empNotes
  });

  // 6. Linked Employee Activity depth check
  let activityImpact = 0;
  let activityNotes = "";
  if (data.hasEmployeeActivity === false) {
    activityImpact = -15;
    activityNotes = "Associated 'employees' exhibit placeholder profiles: no posts, low connection counts (<100), and static generic headshots. Common hallmark of bot syndicates.";
  } else if (data.hasEmployeeActivity === "undefined") {
    activityImpact = -5;
    activityNotes = "Employee activity feedback status is unverified.";
  } else {
    activityImpact = 0;
    activityNotes = "Connected employees represent organic, active profiles with standard professional trails.";
  }
  score += activityImpact;
  breakdown.push({
    label: "Organic Profile Activity Depth",
    impact: activityImpact,
    isRedFlag: data.hasEmployeeActivity === false,
    notes: activityNotes
  });

  // 7. LinkedIn Corporate Page Creation Date
  let ageCreationImpact = 0;
  let ageCreationNotes = "";
  if (data.linkedinPageCreation === "recent") {
    ageCreationImpact = -25;
    ageCreationNotes = "The company's LinkedIn page was created extremely recently (e.g., within 3-4 weeks). Fraud teams operate pages, capture applicants, and discard them rapidly upon reporting.";
  } else if (data.linkedinPageCreation === "undefined") {
    ageCreationImpact = -5;
    ageCreationNotes = "Page initial creation year remains unconfirmed.";
  } else {
    ageCreationImpact = 0;
    ageCreationNotes = "The corporate page registration dates back years, aligning with their corporate history statements.";
  }
  score += ageCreationImpact;
  breakdown.push({
    label: "Company Page Tenure History",
    impact: ageCreationImpact,
    isRedFlag: data.linkedinPageCreation === "recent",
    notes: ageCreationNotes
  });

  // 8. Third-Party Independent Footprint (Glassdoor / Crunchbase / Better Business Bureau / Opencorporates official registry lists)
  let footprintImpact = 0;
  let footprintNotes = "";
  if (data.externalFootprint === "missing") {
    footprintImpact = -20;
    footprintNotes = "No independent records found on Glassdoor reviews, Crunchbase, Better Business Bureau, or official local legal registrations. Scammers easily fake site domains but cannot falsify global state legal frameworks.";
  } else if (data.externalFootprint === "flagged") {
    footprintImpact = -40;
    footprintNotes = "CRITICAL: The company name holds active warnings, fraud reports, or identity phish alerts on trusted scam databases or Glassdoor worker reviews.";
  } else if (data.externalFootprint === "undefined") {
    footprintImpact = -5;
    footprintNotes = "External directory registration lookup unverified.";
  } else {
    footprintImpact = 0;
    footprintNotes = "Official legal registry files, Crunchbase rounds, or Glassdoor indexes correspond securely.";
  }
  score += footprintImpact;
  breakdown.push({
    label: "Independent Corporate Footprint",
    impact: footprintImpact,
    isRedFlag: data.externalFootprint === "flagged" || data.externalFootprint === "missing",
    notes: footprintNotes
  });

  // 9. No Friction Interview process (WhatsApp/Skype chat interview)
  let interviewImpact = 0;
  let interviewNotes = "";
  if (data.hasNoFrictionInterview === true) {
    interviewImpact = -30;
    interviewNotes = "Indicates text-only fast assessments, job offers based purely on Telegram/WhatsApp/Skype message conversations. Authentic enterprises conduct multi-stage video or on-site candidate screens.";
  } else if (data.hasNoFrictionInterview === "undefined") {
    interviewImpact = -5;
    interviewNotes = "Unclear communication channels details.";
  } else {
    interviewImpact = 0;
    interviewNotes = "Listing details describe standard secure ATS portals or direct interview pipelines.";
  }
  score += interviewImpact;
  breakdown.push({
    label: "Chat Application Interviews",
    impact: interviewImpact,
    isRedFlag: data.hasNoFrictionInterview === true,
    notes: interviewNotes
  });

  // 10. Upfront Financial / Equipment check asks
  let finImpact = 0;
  let finNotes = "";
  if (data.hasFinancialRequests === true) {
    finImpact = -40;
    finNotes = "Asks you to purchase specialized startup software/hardware, pay certification fees, or purchase gear using a pending 'reimbursement check'. This is the classic advance fee fake check scam.";
  } else if (data.hasFinancialRequests === "undefined") {
    finImpact = -5;
    finNotes = "Unverified parameters regarding equipment allocations.";
  } else {
    finImpact = 0;
    finNotes = "Zero evidence of credit-checks, paid training software fees, or background check purchases.";
  }
  score += finImpact;
  breakdown.push({
    label: "Upfront Cash & Start Fees",
    impact: finImpact,
    isRedFlag: data.hasFinancialRequests === true,
    notes: finNotes
  });

  // 11. Generic Emails check
  let emailImpact = 0;
  let emailNotes = "";
  if (data.hasGenericEmails === true) {
    emailImpact = -20;
    emailNotes = "Directs candidate applications or recruiters contact to generic mail channels (@gmail.com, @outlook.com, @proton.me). Reputable agencies route through their verified enterprise handle domain.";
  } else if (data.hasGenericEmails === "undefined") {
    emailImpact = -5;
    emailNotes = "Primary recruiter contact domain handle is unverified.";
  } else {
    emailImpact = 0;
    emailNotes = "Application procedures route exclusively to official brand domains.";
  }
  score += emailImpact;
  breakdown.push({
    label: "Recruiting Handle Legitimacy",
    impact: emailImpact,
    isRedFlag: data.hasGenericEmails === true,
    notes: emailNotes
  });

  // 12. Unrealistic compensation
  let payImpact = 0;
  let payNotes = "";
  if (data.hasUnrealisticPay === true) {
    payImpact = -15;
    payNotes = "Exorbitant Hourly / Weekly rewards promised (such as $45/hour for minimal virtual data entry or admin help). Typical bait designed to harvest bank data or logins.";
  } else if (data.hasUnrealisticPay === "undefined") {
    payImpact = -5;
    payNotes = "Estimated wage rate fits standard levels but lacks detailed verification.";
  } else {
    payImpact = 0;
    payNotes = "Pay rewards fit within standard enterprise bracket ranges.";
  }
  score += payImpact;
  breakdown.push({
    label: "Compensation Realism Analysis",
    impact: payImpact,
    isRedFlag: data.hasUnrealisticPay === true,
    notes: payNotes
  });

  // 13. Easy Apply Redirect Scams
  let redirectImpact = 0;
  let redirectNotes = "";
  if (data.hasEasyApplyRedirect === true) {
    redirectImpact = -20;
    redirectNotes = "Acting as a redirect decoy. When clicked, it routes out of the job board to a hostile portal requesting registration fees or signing up on paid credit review hubs.";
  } else if (data.hasEasyApplyRedirect === "undefined") {
    redirectImpact = -5;
    redirectNotes = "Redirection path is undetermined.";
  } else {
    redirectImpact = 0;
    redirectNotes = "Standard in-board application or routing directly to well-known ATS handles (Workday, Lever, Greenhouse).";
  }
  score += redirectImpact;
  breakdown.push({
    label: "Application Link Redirect Safety",
    impact: redirectImpact,
    isRedFlag: data.hasEasyApplyRedirect === true,
    notes: redirectNotes
  });

  // Clamp scoring range 0-100
  if (score < 0) score = 0;
  if (score > 100) score = 100;

  let classification: "safe" | "warning" | "danger" = "safe";
  let summary = "";

  if (score >= 80) {
    classification = "safe";
    summary = "High Verifiable Transparency. The corporate footprint and job posting parameters represent legitimate enterprise recruitment pathways with clean indicators across all categories.";
  } else if (score >= 50) {
    classification = "warning";
    summary = "Cautionary Rating. Several signal warning flags were caught (such as missing external ratings or an unverified page handle). Proceed carefully and run offline identity confirmations.";
  } else {
    classification = "danger";
    summary = "Extreme Threat Warning. High hazard level of advance-fee scams, personal credential phishing, or digital fake checks. Avoid submitting any documents or personal identifiers!";
  }

  return {
    score,
    class: classification,
    summary,
    breakdown
  };
}
