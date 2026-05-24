import { JobAnalysisData } from "../types";

export interface TestCase {
  id: string;
  name: string;
  company: string;
  description: string;
  tier: "Legitimate" | "Suspicious" | "Scam";
  summary: string;
  mockData: JobAnalysisData;
}

export const testCases: TestCase[] = [
  {
    id: "stripe-eng",
    name: "1. Stripe - Remote Staff Software Engineer",
    company: "Stripe",
    tier: "Legitimate",
    summary: "Standard highly reputable enterprise posting with verified domains, older age tenure, and proper Applicant Tracking links.",
    description: `Stripe is looking for a Staff Software Engineer to join our Core Security Platforms team. 
You will build, scale, and maintain absolute baseline encryption APIs trusted by millions.
Requirements:
- 8+ years of production experience in Ruby, Go, Java, or Node.js.
- Deep expertise in secure protocol designs, SSL/TLS handshakes, and cryptographic key rotates.
- Excellent written communication skills.

To apply, please submit your resume via the Stripe Careers portal (jobs.stripe.com). We manage all applications via our secure Greenhouse ATS.
Stripe is an equal opportunity employer. We do not charge application fees or request equipment purchases upfront. All hardware is shipped pre-configured via corporate shipping channels.`,
    mockData: {
      companyUrl: "stripe.com",
      isHttps: true,
      domainAge: "Old",
      hasNordVpnAlert: false,
      linkedinBadge: "verified",
      linkedinEmployees: "many",
      hasEmployeeActivity: true,
      linkedinPageCreation: "established",
      externalFootprint: "robust",
      hasNoFrictionInterview: false,
      hasFinancialRequests: false,
      hasGenericEmails: false,
      hasUnrealisticPay: false,
      hasEasyApplyRedirect: false,
      suspiciousKeywordsFound: [],
      evidenceNotes: "Established in 2011. Domain stripe.com has 14+ years of reputation history. Over 8,000 workers registered on LinkedIn. Active Glassdoor score of 4.3 with 1,200 verified employee reviews.",
      scamIndicators: []
    }
  },
  {
    id: "airbnb-pm",
    name: "2. Airbnb - Senior Product Manager",
    company: "Airbnb",
    tier: "Legitimate",
    summary: "Authentic corporate posting for a senior management position, showing long domain record and verified social media channels.",
    description: `Airbnb is seeking an experienced Senior Product Manager to lead user authentication and security features.
Responsibilities:
- Collaborate with engineering, data science, and design to design frictionless sign-in workflows.
- Research modern safety layers, preventing account takeover attempts, and managing MFA enrollments.
- Standard benefits, 401(k) match, health coverage, and flexible travel credits.

How to Apply: Please submit your portfolio link directly through careers.airbnb.com or via LinkedIn Easy Apply redirecting to our internal Workday. We will never communicate with you via WhatsApp or Telegram. All scheduling happens via official @airbnb.com emails.`,
    mockData: {
      companyUrl: "airbnb.com",
      isHttps: true,
      domainAge: "Old",
      hasNordVpnAlert: false,
      linkedinBadge: "verified",
      linkedinEmployees: "many",
      hasEmployeeActivity: true,
      linkedinPageCreation: "established",
      externalFootprint: "robust",
      hasNoFrictionInterview: false,
      hasFinancialRequests: false,
      hasGenericEmails: false,
      hasUnrealisticPay: false,
      hasEasyApplyRedirect: false,
      suspiciousKeywordsFound: [],
      evidenceNotes: "Founded in 2008. Airbnb.com boasts an impeccable secure web track record. Over 6,000 active employees. High organic profile activity on LinkedIn.",
      scamIndicators: []
    }
  },
  {
    id: "patagonia-analyst",
    name: "3. Patagonia - Sustainability Data Analyst",
    company: "Patagonia",
    tier: "Legitimate",
    summary: "Authentic job post for an environmental analyst. Contains legal disclosures, clear corporate handles, and standard enterprise steps.",
    description: `Patagonia is hiring a Sustainability Data Analyst to join our team in Ventura, CA (Hybrid). 
You will parse supply-chain carbon metric spreadsheets to verify our Net-Zero emissions progression.
Core qualifications:
- Strong skills in Python, SQL, or Tableau.
- Passion for environmental activism and supply-chain logistics.
Applying is simple: Fill out your profile details on our career portal (patagonia.com/careers). We do not send checks for home offices or run text chats. Interviews involve structured video sessions on Zoom with panel members.`,
    mockData: {
      companyUrl: "patagonia.com",
      isHttps: true,
      domainAge: "Old",
      hasNordVpnAlert: false,
      linkedinBadge: "verified",
      linkedinEmployees: "many",
      hasEmployeeActivity: true,
      linkedinPageCreation: "established",
      externalFootprint: "robust",
      hasNoFrictionInterview: false,
      hasFinancialRequests: false,
      hasGenericEmails: false,
      hasUnrealisticPay: false,
      hasEasyApplyRedirect: false,
      suspiciousKeywordsFound: [],
      evidenceNotes: "Patagonia.com registered in 1995. Official LinkedIn with verified blue mark. Hundreds of employee accounts showing genuine conference participation and activity trail.",
      scamIndicators: []
    }
  },
  {
    id: "fictional-startup",
    name: "4. Zettaflow - Junior Front-End Developer",
    company: "Zettaflow",
    tier: "Suspicious",
    summary: "A younger verified early-stage startup. Safe but warrants minor caution since the domain is relatively young and has a moderate footprint.",
    description: `Zettaflow is an early-stage Web3 developer tools startup. We recently raised our Seed funding round.
We are looking for a remote Junior Frontend Developer to build React modules using Tailwind CSS and Vite.
This is a remote contract position starting at $30 - $40/hour depending on experience.
To apply: Email your github link and resume directly to founders@zettaflow.io or apply through angular-jobs board.
We conduct video check-ins via Google Meet. All contract agreements are governed by legal Delaware structure laws.`,
    mockData: {
      companyUrl: "zettaflow.io",
      isHttps: true,
      domainAge: "Mid",
      hasNordVpnAlert: false,
      linkedinBadge: "unverified",
      linkedinEmployees: "few",
      hasEmployeeActivity: true,
      linkedinPageCreation: "established",
      externalFootprint: "robust",
      hasNoFrictionInterview: false,
      hasFinancialRequests: false,
      hasGenericEmails: false,
      hasUnrealisticPay: false,
      hasEasyApplyRedirect: false,
      suspiciousKeywordsFound: [],
      evidenceNotes: "Zettaflow is a genuine small tech startup founded 2 years ago. Stable SSL site. LinkedIn page exists but lacks verification badge due to small team sizes (3 active associated employee accounts). Crunchbase ledger confirms Seed round.",
      scamIndicators: []
    }
  },
  {
    id: "easyapply-redirect",
    name: "5. CareerGate - 'Easy Apply' Training Decoy",
    company: "CareerGate (Agent)",
    tier: "Suspicious",
    summary: "An 'Easy Apply' redirect scam where the job posting is just a shell to divert users to paid registration or credit check portals.",
    description: `URGENT: Entry Level Customer Support Representative. Remote, No Experience Required.
$25/hour starting base wage. Complete training provided.
Simply click apply! You will coordinate with our team at quickregister-hubs.info to enroll in our prerequisite training certification first. 
Once you pass the brief $15 credit history check on our portal, you will be guaranteed a virtual interview stream with leading fortune 500 managers.`,
    mockData: {
      companyUrl: "quickregister-hubs.info",
      isHttps: true,
      domainAge: "New",
      hasNordVpnAlert: false,
      linkedinBadge: "unverified",
      linkedinEmployees: "none",
      hasEmployeeActivity: false,
      linkedinPageCreation: "recent",
      externalFootprint: "missing",
      hasNoFrictionInterview: false,
      hasFinancialRequests: true,
      hasGenericEmails: false,
      hasUnrealisticPay: false,
      hasEasyApplyRedirect: true,
      suspiciousKeywordsFound: ["credit history check", "apply"],
      evidenceNotes: "The posting acts as an 'easy apply' redirect shell, sending applicants to quickregister-hubs.info (under 1 month old). No employees. No Glassdoor ratings. Pre-certification fee required.",
      scamIndicators: ["enroll in our prerequisite training certification first", "brief $15 credit history check"]
    }
  },
  {
    id: "scam-tele-check",
    name: "6. Text-Interview & Laptop Check scam",
    company: "Apex Global Logistics (Spoof)",
    tier: "Scam",
    summary: "Classic advance-fee recruitment scam. Offers work-from-home data entry, performs immediate interview on Telegram, and demands purchasing equipment through a digital check reimbursement scheme.",
    description: `Apex Global Logistics is seeking five (5) remote Data Entry Operators for immediate placement.
Full Time & Part Time remote openings. Shift hours are highly flexible.
Salary: $42.50 per hour / training wage: $25.00 per hour.
Duties:
- Input customer billing coordinates into database.
- Receive package logistics receipts from your senior team leader.
To apply, download the Telegram App on your phone/computer and search for our HR hiring manager with username @ApexLogisticsHiring. Setup your profile and send code ApexLog-88 for a direct message text-chat interview session.
Once hired, or if you do not have office hardware, we will send you a digital check to deposit on your bank app. You must use these funds to purchase your Apple iMac, scanners, and time-tracker software bundle from our certified equipment vendor.`,
    mockData: {
      companyUrl: "apex-logistics-careers.net",
      isHttps: false,
      domainAge: "New",
      hasNordVpnAlert: true,
      linkedinBadge: "undefined",
      linkedinEmployees: "none",
      hasEmployeeActivity: false,
      linkedinPageCreation: "recent",
      externalFootprint: "missing",
      hasNoFrictionInterview: true,
      hasFinancialRequests: true,
      hasGenericEmails: true,
      hasUnrealisticPay: true,
      hasEasyApplyRedirect: false,
      suspiciousKeywordsFound: ["Telegram", "check", "@ApexLogisticsHiring", "iMac", "equipment"],
      evidenceNotes: "Newly registered spoof domain. No valid HTTPS. No LinkedIn employee presence. Uses @ApexLogisticsHiring on Telegram. Instructs candidates to deposit a check and coordinate payments with their private vendor.",
      scamIndicators: [
        "download the Telegram App on your phone",
        "send you a digital check to deposit on your bank app",
        "purchase your Apple iMac, scanners, and time-tracker software"
      ]
    }
  },
  {
    id: "scam-gmail-assistant",
    name: "7. Google-Email & WhatsApp Interview scam",
    company: "EcoSmart Solutions",
    tier: "Scam",
    summary: "Common phishing decoy recruiting virtual administrative interns using free Gmail contacts and conducting rapid job offers over WhatsApp.",
    description: `EcoSmart Solutions is expanding! We are hiring a Remote Administrative Assistant Intern.
No prior experience is necessary, as we value an open-mind above everything else.
Salary: $35/hour. 15-20 hours a week.
General responsibilities include sorting email inboxes, booking zoom invites, and ordering online office gift cards.
Please email your resume directly to ecosmartsolutionsHR@gmail.com. We do not use portals to prevent administrative lag. If selected, our HR panel will message you on WhatsApp to finalize the paper contract within 2 hours.`,
    mockData: {
      companyUrl: "undefined",
      isHttps: "undefined",
      domainAge: "Undefined",
      hasNordVpnAlert: "undefined",
      linkedinBadge: "unverified",
      linkedinEmployees: "none",
      hasEmployeeActivity: false,
      linkedinPageCreation: "recent",
      externalFootprint: "missing",
      hasNoFrictionInterview: true,
      hasFinancialRequests: false,
      hasGenericEmails: true,
      hasUnrealisticPay: true,
      hasEasyApplyRedirect: false,
      suspiciousKeywordsFound: ["WhatsApp", "gmail.com", "gift cards"],
      evidenceNotes: "EcoSmart Solutions does not have an active corporate domain. Uses ecosmartsolutionsHR@gmail.com for resume collection. Rapid onboarding over WhatsApp message streams without professional vetting checks.",
      scamIndicators: [
        "ecosmartsolutionsHR@gmail.com",
        "our HR panel will message you on WhatsApp to finalize the paper contract"
      ]
    }
  },
  {
    id: "scam-credit-score",
    name: "8. Paid Background Screen Phishing hook",
    company: "Weston Financial Associates (Spoof)",
    tier: "Scam",
    summary: "Phishing vector disguised as an immediate administrative assistant, baiting candidates into a phishing link to pay for background reports.",
    description: `Weston Financial Associates is in urgent search of an Executive Virtual Assistant.
Work remote. Responsibilities: scheduling, file indexing, answering telephone loops, and draft reviews.
Salary: $38 - $45/hour.
Requirements: Must have strong organization records and pass a clean criminal record background check.
IMPORTANT Application Guideline: We require all virtual applicants to pre-validate their background eligibility using our authorized vendor site (nationalprofilecheckers.org). Note there is an organic $29 fee for immediate verification generation. Candidates will be refunded on their first payment sheet. Do not submit your resume to us before loading the proof receipt.`,
    mockData: {
      companyUrl: "nationalprofilecheckers.org",
      isHttps: true,
      domainAge: "New",
      hasNordVpnAlert: true,
      linkedinBadge: "unverified",
      linkedinEmployees: "none",
      hasEmployeeActivity: false,
      linkedinPageCreation: "recent",
      externalFootprint: "flagged",
      hasNoFrictionInterview: false,
      hasFinancialRequests: true,
      hasGenericEmails: false,
      hasUnrealisticPay: true,
      hasEasyApplyRedirect: true,
      suspiciousKeywordsFound: ["profiles check", "$29", "background"],
      evidenceNotes: "Domain nationalprofilecheckers.org registered 18 days ago. Verified on multiple scam databases for phishing background fees. Weston Financial has zero profiles on Crunchybase or Glassdoor.",
      scamIndicators: [
        "pre-validate their background eligibility using our authorized vendor site",
        "nationalprofilecheckers.org",
        "organic $29 fee for immediate verification"
      ]
    }
  },
  {
    id: "scam-skype-typing",
    name: "9. Skype Chat typing scam",
    company: "AstraZeneca Labs (Lookalike Spoof)",
    tier: "Scam",
    summary: "Impersonation fraud of a global pharmaceutical firm. Relies on Skype text sessions and promises upfront starting iMac gear via paper checks.",
    description: `AstraZeneca Pharmaceuticals has urgent openings for remote Typing Operators.
Duties: Type copy manuscripts on Microsoft Word and convert raw data files to PDF documents.
Earn up to $3,500 monthly. Flexible schedule, work full time or part time.
To join the AstraZeneca onboarding team, you must add our lead recruiting administrator on Skype. Skype ID: live:.cid.astrazeneca_hiring_office. Send message: 'HIRE ME'.
Following the simple text chat interview, we will ship your office equipment. If you do not have an active secure device, we will send an electronic check to buy software licenses from our accredited vendor.`,
    mockData: {
      companyUrl: "astrazeneca-careers-portal.co",
      isHttps: false,
      domainAge: "New",
      hasNordVpnAlert: true,
      linkedinBadge: "unverified",
      linkedinEmployees: "none",
      hasEmployeeActivity: false,
      linkedinPageCreation: "recent",
      externalFootprint: "flagged",
      hasNoFrictionInterview: true,
      hasFinancialRequests: true,
      hasGenericEmails: true,
      hasUnrealisticPay: false,
      hasEasyApplyRedirect: false,
      suspiciousKeywordsFound: ["Skype", "check", "equipment", "AstraZeneca Labs"],
      evidenceNotes: "Lookalike domain registered last week to copy Astrazeneca. Generates fake electronic software checks. Pure typing data entry text chat recruit via Skype with zero biometric video safety verification.",
      scamIndicators: [
        "Skype ID: live:.cid.astrazeneca_hiring_office",
        "send an electronic check to buy software licenses"
      ]
    }
  },
  {
    id: "scam-giftcard-buyer",
    name: "10. Secret Shopper / Gift Card buyer phish",
    company: "Target Retail Services (Spoof)",
    tier: "Scam",
    summary: "Data-harvesting phish targeted at teenagers and students, recruiting 'Secret Shoppers' to purchase Apple gift cards to check network speeds.",
    description: `ATTENTION STUDENTS! Earn extra spending money in your free time!
Target Retail Services is hiring Seasonal Mystery Evaluators.
Earn $350 per assignment. Complete 2 assignments weekly!
Assignment Protocol:
- Navigate to local retail stores (Macy's, Apple, Walmart).
- Evaluate clerk hospitality records, safety conditions, and register times.
- Purchase designated $100 Apple/Google Play Gift Cards at the checkout to test POS electronic terminal speeds.
- Send clear scratch-off coupon barcode photos to our HR review handle (targetmysteryops@outlook.com) to confirm completion.
We will provide immediate credit refunds plus your mystery reward within 24 hours of barcode submission!`,
    mockData: {
      companyUrl: "targetretailjobs.com",
      isHttps: false,
      domainAge: "New",
      hasNordVpnAlert: true,
      linkedinBadge: "undefined",
      linkedinEmployees: "none",
      hasEmployeeActivity: false,
      linkedinPageCreation: "recent",
      externalFootprint: "flagged",
      hasNoFrictionInterview: true,
      hasFinancialRequests: true,
      hasGenericEmails: true,
      hasUnrealisticPay: true,
      hasEasyApplyRedirect: false,
      suspiciousKeywordsFound: ["gift cards", "scratch-off", "outlook.com"],
      evidenceNotes: "Scam domain registered to harvest credit credentials. Outlook.com handle. Mystery shop scams target candidates by asking them to purchase gift cards and email scratch-off barcodes to anonymous profiles.",
      scamIndicators: [
        "targetmysteryops@outlook.com",
        "Purchase designated $100 Apple/Google Play Gift Cards",
        "Send clear scratch-off coupon barcode photos"
      ]
    }
  }
];
