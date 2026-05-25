import { JobAnalysisData } from "../types";

export interface TestCase {
  id: string;
  name: string;
  company: string;
  role: string;
  url: string;
  description: string;
  tier: "Legitimate" | "Suspicious" | "Scam";
  summary: string;
  mockData: JobAnalysisData;
}

export const testCases: TestCase[] = [
  {
    id: "job1-crossing-hurdles",
    name: "1. Crossing Hurdles - Web Developer (HTML,CSS) | Remote",
    company: "Crossing Hurdles",
    role: "Web Developer (HTML,CSS) | Remote",
    url: "https://www.linkedin.com/",
    tier: "Suspicious",
    summary: "Suspiciously simple listing requesting general frontend developer skills, pushing users to \"Easy Apply\" and check emails for an interview, which could be an 'Easy Apply' phishing scheme.",
    description: `About the job\nPosition: Frontend Developer (HTML, CSS)\nType: Hourly contract\nCompensation: $30 $120/hour\nLocation: Remote\nCommitment: 10 40 hours/week\n\nRole Responsibilities\nBuild responsive and reusable UI components using modern frontend technologies.\nTranslate design files into interactive and scalable web interfaces.\nCollaborate with UX/UI designers and backend developers on integrated solutions.\nDevelop and optimize frontend functionality using React, Angular, Vue.js, Bootstrap, and JavaScript.\nIntegrate frontend applications with APIs and backend services.\nExecute testing processes to ensure code quality and maintainability.\nTroubleshoot and resolve frontend performance and usability issues. \n\nRequirements\nExpert proficiency in HTML, CSS, and JavaScript.\nStrong experience with React, Angular, Vue.js, and Bootstrap.\nExperience converting design files into responsive interfaces.\nKnowledge of API integration and backend connectivity.\nFamiliarity with scalable UI architecture and modular frontend development.\nExperience with unit testing and automation testing practices.\nStrong communication, collaboration, and problem-solving skills. \n\nApplication Process (Takes 20 Min)\nEasy Apply on LinkedIn\nCheck email for next steps\nParticipate in resume evaluation & interview stage\n\nDesired Skills and Experience\nHTML`,
    mockData: {
      companyUrl: "www.crossinghurdles.com",
      linkedinUrl: "https://www.linkedin.com/company/crossinghurdles/",
      isHttps: true,
      domainAge: "mid",
      hasNordVpnAlert: false,
      linkedinBadge: "unverified",
      linkedinEmployees: "boutique",
      hasEmployeeActivity: "low",
      linkedinPageCreation: "historical",
      externalFootprint: "undefined",
      flaggedSourceUrls: [],
      hasNoFrictionInterview: false,
      hasFinancialRequests: false,
      hasGenericEmails: false,
      hasUnrealisticPay: false,
      hasEasyApplyRedirect: true,
      suspiciousKeywordsFound: ["easy apply", "check email", "takes 20 min"],
      evidenceNotes: "Company 'Crossing Hurdles' has very little verified robust footprint externally. The role pushes users to an Easy Apply funnel which is often a red flag.",
      scamIndicators: ["Check email for next steps"]
    }
  },
  {
    id: "job2-microsoft",
    name: "2. Microsoft - Azure Apps and AI Solution Engineer",
    company: "Microsoft",
    role: "Azure Apps and AI Solution Engineer",
    url: "https://careers.microsoft.com/",
    tier: "Legitimate",
    summary: "Authentic corporate posting from Microsoft for a specialized technical role, featuring detailed compliance and equal opportunity language.",
    description: `About the job\nOverview\n\nAre you curious, passionate about building intelligent applications, and ready to solve complex challenges in the AI era? Join us as a Cloud & AI Apps and AI Solution Engineer — We are looking for an Azure Apps and AI Solution Engineer who is a deep subject‑matter expert in designing and delivering modern, intelligent applications using Azure AI Foundry, agentic AI patterns, and the Azure app platform, and who can partner with customers to modernize their application estates and enable AI‑powered workloads, helping technical decision‑makers confidently approve and adopt Azure Apps and AI solutions.In this technical sales role, you'll help customers design secure, scalable, and resilient cloud application architectures that support their AI modernization goals. Using Azure's modern AI and app platform PaaS services, you'll guide organizations through application modernization—designing and optimizing governed, AI‑ready intelligent applications and translating technical capabilities into measurable business outcomes.You'll collaborate across teams to deliver impactful solutions that enhance agility, reduce costs, and unlock value through AI-powered applications.At Small Medium Enterprises and Channel (SME&C), we are leading a high-growth, AI-powered global sales team—one that is deeply connected to our partners and driven by customer success. By uniting our Small Medium Business, Corporate, Strategy, and Partner teams, we are unlocking the largest customer opportunity, backed by the industry's most significant investments. Leveraging the power of AI and our extensive partner ecosystem, we are redefining how businesses of all sizes adopt technology to drive growth and innovation.SME&C is more than a sales organization—it's a culture of innovation, opportunity, and inclusivity. Here, you'll be part of a diverse, high-performing, and customer-obsessed team where collaboration, connection, and continuous learning fuel everything we do.If you thrive in a fast-paced, digital-first environment and are eager to make a meaningful impact, explore how SME&C can be the next step in your career. Together, we are shaping the future of business.As a Cloud & AI Apps and AI Solution Engineer, you'll play a key role in helping mid-market customers modernize their application estates and unlock the full value of Microsoft's cloud. You'll work directly with technical and business stakeholders to design and implement secure, scalable, and resilient architectures that support AI workloads and business-critical applications.Ability to guide customers through application and AI platform modernization decisions, balancing architecture, governance, cost, and performance considerations to enable AI‑ready and enterprise‑scale outcomes.Growth & Career DevelopmentOpportunity to accelerate career growth by modernizing customer environments and enabling secure Cloud & AI adoptionDeepen technical proficiency in architecture design, AI application development, and cloud-native solutionsBuild strategic influence by shaping application, AI, and platform modernization decisions for AI‑driven business workloadsDevelop future‑ready capabilities through continuous learning, certifications, and hands‑on experience with Microsoft Cloud & AI technologies\n\nResponsibilities\n\nCore Skills (All Solution Engineers)Solid technical foundation designing and modernizing Cloud & AI solutions on Azure, partnering with customers to move from legacy environments to secure, scalable cloud‑native architecturesAbility to lead technical migration and modernization discussions, applying structured approaches (e.g., 6R strategy) to guide customer decisionsExperience influencing technical decision makers (architects, platform leads, engineering managers) by translating complex architecture into clear, defensible solutionsSolid understanding of hybrid and cloud‑native architectures, including networking fundamentals (virtual networks, secure connectivity, routing, performance considerations)Knowledge of Azure security and compliance principles, including identity, networking security, data protection, and alignment to regulatory and compliance frameworksHands‑on technical mindset with the ability to design, validate, and explain architectures, not just describe servicesProven collaboration skills working with customers, partners, engineering teams, and account stakeholders to deliver outcomesCommitment to continuous learning, leveraging Microsoft training resources, hands‑on labs, and certifications to deepen Cloud & AI expertiseDrive technical sales by using technical demos, proof of concepts, and technical architecture accelerators to influence solution design and enable deploymentsLead architecture sessions and technical workshops to accelerate Cloud & AI adoptionBuild trusted relationships with platform leads to co-design secure, scalable solutionsResolve technical blockers by collaborating with engineering and sharing customer insightsRepresent Microsoft in customer forums and technical communities through thought leadership\n\nQualifications\n\nRequired/minimum qualifications\n\nBachelor's Degree in Computer Science, Information Technology, Engineering or related field AND 6+ years technical pre-sales or technical consulting experience OR equivalent experience.\nHands-on experience designing production-grade, intelligent applications on Azure using AI Foundry, cloud-native app platform services (AKS, Container Apps, App Service), with the ability to guide customers through end-to-end AI application modernization decisions.\n\nAdditional Or Preferred Qualifications\n\nHands‑on experience building and shipping generative AI workloads on Azure, including RAG architectures, multi-agent orchestration, LLM engineering fundamentals (chunking/embedding strategy, hybrid search, reranking, eval-driven development), and integration with Azure AI Search.\nSolid understanding of end‑to‑end AI application architecture concepts, including model selection, prompt engineering, tool calling and MCP (Model Context Protocol), content safety, observability, and responsible AI practices.\nExperience building and deploying cloud-native applications across the Azure app platform—AKS, Container Apps, App Service, and Functions—and integrating AI capabilities via API Management, Copilot Studio, and GitHub Copilot to support intelligent, enterprise-scale workloads.\nAbility to guide customers through application and AI platform modernization decisions, balancing architecture, governance, cost, and performance considerations to enable AI‑ready and enterprise‑scale outcomes.\n\nDigital Solution Engineering IC5 - The typical base pay range for this role across Canada is CAD $128,000 - CAD $222,400 per year.\n\nFind Additional Pay Information Here\n\nhttps://careers.microsoft.com/v2/global/en/canada-pay-information.html\n\nDigital Solution Engineering IC5 - L'échelle salariale de base typique pour ce rôle dans l'ensemble du Canada est de 128,000 $ CAD à 222,400 $ CAD par année.\n\nPour plus d'information au sujet de la rémunération, veuillez cliquer ici:\n\nhttps://careers.microsoft.com/v2/global/en/canada-pay-information.html\n\nCe poste sera ouvert pendant au moins cinq jours et les candidatures seront acceptées de façon continue jusqu’à ce que le poste soit pourvu.\n\nThis position will be open for a minimum of 5 days, with applications accepted on an ongoing basis until the position is filled.\n\nMicrosoft est un employeur offrant l’égalité d’accès à l’emploi. Tous les candidats qualifiés seront pris en considération pour l’emploi, sans égard à l’âge, à l’ascendance, à la citoyenneté, à la couleur, aux congés médicaux ou familiaux, à l’identité ou à l’expression de genre, aux renseignements génétiques, à l’état d’immigration, à l’état matrimonial, à l’état de santé, à l’origine nationale, à un éventuel handicap physique ou mental, à l’affiliation politique, au statut de vétéran protégé ou au statut militaire, à la race, à l’ethnie, à la religion, au sexe (y compris la grossesse), à l’orientation sexuelle ou à toute autre caractéristique protégée par les lois, ordonnances et règlements locaux applicables. Si vous avez besoin d’aide avec des accommodements religieux et/ou d’un accommodement raisonnable en raison d’un handicap pendant le processus de candidature, apprenez-en plus sur la demande d’accommodement.\n\nMicrosoft is an equal opportunity employer. All qualified applicants will receive consideration for employment without regard to age, ancestry, citizenship, color, family or medical care leave, gender identity or expression, genetic information, immigration status, marital status, medical condition, national origin, physical or mental disability, political affiliation, protected veteran or military status, race, ethnicity, religion, sex (including pregnancy), sexual orientation, or any other characteristic protected by applicable local laws, regulations and ordinances. If you need assistance with religious accommodations and/or a reasonable accommodation due to a disability during the application process, read more about requesting accommodations.`,
    mockData: {
      companyUrl: "microsoft.com",
      linkedinUrl: "https://www.linkedin.com/company/microsoft",
      isHttps: true,
      domainAge: "old",
      hasNordVpnAlert: false,
      linkedinBadge: "verified",
      linkedinEmployees: "large",
      hasEmployeeActivity: "organic",
      linkedinPageCreation: "historical",
      externalFootprint: "found",
      flaggedSourceUrls: [],
      hasNoFrictionInterview: false,
      hasFinancialRequests: false,
      hasGenericEmails: false,
      hasUnrealisticPay: false,
      hasEasyApplyRedirect: false,
      suspiciousKeywordsFound: [],
      evidenceNotes: "Microsoft is a multinational tech corporation founded in 1975. Verified LinkedIn presence with tens of thousands of active workers. Thoroughly legitimate standard posting.",
      scamIndicators: []
    }
  },
  {
    id: "job3-hunter-bond",
    name: "3. Hunter Bond - Software Engineer",
    company: "Hunter Bond",
    role: "Software Engineer - Up to $200,000 CAD + Bonus + Package",
    url: "https://hunterbond.com/",
    tier: "Legitimate",
    summary: "Standard third-party recruiting firm posting. Uses direct recruiter email approach but points to a real corporate domain.",
    description: `About the job\n💻 Software Developer (Language Agnostic)\n\n📍 Montreal (Hybrid)\n💵 Up to $200,000 CAD + Bonus + Full Package\n\n\n🚀 The Opportunity\n\nJoin a world-class, technology-driven firm as a Software Engineer, building the systems that power high-performance trading, research, and large-scale back testing.\nThis is a hands-on, high-impact role where your work directly shapes real-time decision-making, system performance, and automation across the trading lifecycle. You’ll collaborate with top-tier engineers and quants in a fast-moving, engineering-first environment.\n\n\n🔧 What You’ll Do\n\nDesign and build scalable, production-grade systems for real-time trading and analytics\nDrive automation to improve speed, reliability, and efficiency across workflows\nPartner with engineers, quants, and stakeholders to deliver high-impact solutions\n\n\n🌟 Why This Role Stands Out\n\n📈 Accelerated Growth – Thrive in a meritocratic, high-performance culture\n🧪 Cutting-Edge Stack – Work with modern technologies and advanced infrastructure\n💰 Strong Compensation – Highly competitive salary with performance-driven bonuses\n🤝 Elite Team – Collaborate in a flat structure with exceptional talent\n\n\n✅ What You Bring\n\n🎓 Degree in Computer Science, Engineering, or a related STEM field\n💻 1+ years of experience in Python, Java, C++, or similar languages\n⚡ A problem-solving mindset and the ability to excel in fast\n\n\nReady to take your software engineering career to the next level in a cutting-edge environment?\n\n\nApply now or reach out to me directly: obloom@hunterbond.com`,
    mockData: {
      companyUrl: "hunterbond.com",
      linkedinUrl: "https://www.linkedin.com/company/hunter-bond",
      isHttps: true,
      domainAge: "old",
      hasNordVpnAlert: false,
      linkedinBadge: "verified",
      linkedinEmployees: "medium",
      hasEmployeeActivity: "organic",
      linkedinPageCreation: "historical",
      externalFootprint: "found",
      flaggedSourceUrls: [],
      hasNoFrictionInterview: false,
      hasFinancialRequests: false,
      hasGenericEmails: false,
      hasUnrealisticPay: false,
      hasEasyApplyRedirect: false,
      suspiciousKeywordsFound: [],
      evidenceNotes: "Hunter Bond is an established recruitment firm. The job description includes a direct email contact for a recruiter with the firm's verified domain (@hunterbond.com).",
      scamIndicators: []
    }
  }
];
