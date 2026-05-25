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
  if (data.domainAge === "new") {
    domainAgeImpact = -35;
    domainNotes = "The company website domain was registered within 1 year. Recruitment scammers frequently rely on brand-new temporary domains to host copycat corporate pages.";
  } else if (data.domainAge === "undefined") {
    domainAgeImpact = -10;
    domainNotes = "No domain registration age could be fetched. Legitimate firms maintain search ground histories.";
  } else if (data.domainAge === "mid") {
    domainAgeImpact = -5;
    domainNotes = "Domain age is in the moderate bracket (1-5 years). Authentic early startup behavior, but requires secondary signal checks.";
  } else if (data.domainAge === "old") {
    domainAgeImpact = 0;
    domainNotes = "Highly robust multi-year domain footprint (5+ years active). Standard Enterprise profile indicator.";
  }
  score += domainAgeImpact;
  breakdown.push({
    label: `Corporate Domain Registry Age: ${data.domainAge}`,
    impact: domainAgeImpact,
    isRedFlag: data.domainAge === "new",
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
    badgeImpact = -10;
    badgeNotes = "The company profile page is explicitly unverified under standard view configurations.";
  } else if (data.linkedinBadge === "login_wall") {
    badgeImpact = 0; // Neutralized: No penalty if browser is blocked by LinkedIn login security
    badgeNotes = "Verification badge visibility is restricted by a platform login wall. No penalty applied; secondary parameters will determine legitimacy.";
  } else if (data.linkedinBadge === "undefined") {
    badgeImpact = -5;
    badgeNotes = "Platform verification data was unavailable during automated analysis.";
  } else {
    badgeImpact = 0;
    badgeNotes = "Corporate identity features an authenticated verification profile.";
  }
  score += badgeImpact;
  breakdown.push({
    label: "Corporate Verification Status",
    impact: badgeImpact,
    isRedFlag: data.linkedinBadge === "unverified",
    notes: badgeNotes
  });

  // 5. LinkedIn Employee count/presence density
  let empImpact = 0;
  let empNotes = "";
  if (data.linkedinEmployees === "none") {
    empImpact = -30;
    empNotes = "Zero linked personnel profiles discovered. A total absence of workers is a primary marker of shell recruitment setups.";
  } else if (data.linkedinEmployees === "boutique") {
    empImpact = 0; // Protected: 1-10 real employees is normal for small consulting agencies
    empNotes = "Boutique workforce profile verified (1-10 profiles). Completely consistent with micro-enterprises and early independent groups.";
  } else if (data.linkedinEmployees === "medium") {
    empImpact = 0;
    empNotes = "Established mid-tier workforce size confirmed (11-50 verified profiles).";
  } else if (data.linkedinEmployees === "large") {
    empImpact = 0;
    empNotes = "Highly robust enterprise workforce deployment verified (>50 associated profiles).";
  } else {
    empImpact = -5;
    empNotes = "Active workforce distribution counts returned unverified.";
  }
  score += empImpact;
  breakdown.push({
    label: `Team Workforce Footprint: ${data.linkedinEmployees}`,
    impact: empImpact,
    isRedFlag: data.linkedinEmployees === "none",
    notes: empNotes
  });

  // 6. Linked Employee Activity depth check
  let activityImpact = 0;
  let activityNotes = "";
  if (data.hasEmployeeActivity === "fake") {
    activityImpact = -25;
    activityNotes = "Associated profiles exhibit automated bot markers: empty accounts, zero public text engagement, and static stock headshots.";
  } else if (data.hasEmployeeActivity === "login_wall") {
    activityImpact = 0; // Neutralized
    activityNotes = "Staff platform engagement histories are protected behind a security sign-in wall. Bypassing check parameters to remain neutral.";
  } else if (data.hasEmployeeActivity === "low" || data.hasEmployeeActivity === "undefined") {
    activityImpact = -5;
    activityNotes = "Organic employee activity records are thin or unverified.";
  } else {
    activityImpact = 0;
    activityNotes = "Associated profiles display regular, active professional footprints.";
  }
  score += activityImpact;
  breakdown.push({
    label: "Team Profile Activity Depth",
    impact: activityImpact,
    isRedFlag: data.hasEmployeeActivity === "fake",
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
    footprintImpact = -25;
    footprintNotes = "No independent records found on Glassdoor, Crunchbase, or corporate legal registrations. Genuine entities maintain external regulatory trails.";
  } else if (data.externalFootprint === "flagged") {
    footprintImpact = -50;
    const sources = data.flaggedSourceUrls && data.flaggedSourceUrls.length > 0 ? ` Source logs: ${data.flaggedSourceUrls.join(', ')}` : "";
    footprintNotes = `CRITICAL FRAUD ALERT: This organization identity matches active risk warnings, scam advisories, or identity phishing reports in public directories.${sources}`;
  } else if (data.externalFootprint === "undefined") {
    footprintImpact = -5;
    footprintNotes = "External directory registration lookup unverified.";
  } else {
    footprintImpact = 0;
    footprintNotes = "Official legal records or historical directory entries found across external frameworks.";
  }
  score += footprintImpact;
  breakdown.push({
    label: "External Registry Footprint Check",
    impact: footprintImpact,
    isRedFlag: data.externalFootprint === "flagged",
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
