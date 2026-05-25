import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert,
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Search, 
  Sliders, 
  Settings, 
  ExternalLink,
  ChevronRight,
  Info,
  RotateCcw,
  AlertTriangle,
  Building2,
  FileText,
  Mail,
  UserCheck,
  Award,
  Link as LinkIcon,
  PlayCircle,
  Briefcase,
  ChevronLeft
} from "lucide-react";
import { JobAnalysisData, GroundingSource, ScoreReport } from "./types";
import { computeTrustScore } from "./utils/scoring";
import { testCases, TestCase } from "./data/testCases";
import Tutorial from "./pages/Tutorial";
import SettingsPage from "./pages/Settings";
import RealUseCases from "./pages/RealUseCases";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // --- States ---
  const [currentStep, setCurrentStep] = useState<1 | 3 | 4>(1); // Step 1 (Input), Step 3 (Review), Step 4 (Result)
  
  // Custom Key Configuration
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    return localStorage.getItem("truejob_custom_key") || "";
  });
  const [useCustomKey, setUseCustomKey] = useState<boolean>(() => {
    return localStorage.getItem("truejob_use_custom") === "true";
  });
  
  // Verification states
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationSuccess, setValidationSuccess] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isEnvKeyAvailable, setIsEnvKeyAvailable] = useState<boolean>(false);

  // Raw Inputs (Step 1)
  const [companyName, setCompanyName] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Loading analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [loadingStepText, setLoadingStepText] = useState<string>("Analyzing listing...");

  // AI Extracted/Staging Data (Step 2/3)
  const [reviewedData, setReviewedData] = useState<JobAnalysisData>({
    companyUrl: "",
    isHttps: "undefined",
    domainAge: "undefined",
    hasNordVpnAlert: "undefined",
    linkedinBadge: "undefined",
    linkedinEmployees: "undefined",
    hasEmployeeActivity: "undefined",
    linkedinPageCreation: "undefined",
    externalFootprint: "undefined",
    flaggedSourceUrls: [],
    hasNoFrictionInterview: "undefined",
    hasFinancialRequests: "undefined",
    hasGenericEmails: "undefined",
    hasUnrealisticPay: "undefined",
    hasEasyApplyRedirect: "undefined",
    suspiciousKeywordsFound: [],
    evidenceNotes: "",
    scamIndicators: []
  });
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);

  // Scoring output results (Step 4)
  const [scoreReport, setScoreReport] = useState<ScoreReport | null>(null);

  // Active Sandbox Preset for Instant Demoing
  const [activePresetMock, setActivePresetMock] = useState<any>(null);

  // Cycling status messages during AI staging analysis
  const statusPhrases = [
    "Submitting ad packet to Zero-Trust analysis engine...",
    "Scanning content for chat app recruitment signals...",
    "Grounding corporate identity on Google Search databases...",
    "Auditing financial requests & home-office equipment promises...",
    "Checking candidate handles against popular generic email lists...",
    "Synthesizing safe verified fields..."
  ];

  // Run initial key validation if available
  useEffect(() => {
    validateActiveConfiguration(true);
  }, []);

  // Clear preset mock if navigated to primary Workspace via browser controls
  useEffect(() => {
    if (location.pathname === "/") {
      if (activePresetMock) {
        handleReset();
      }
    }
  }, [location.pathname]);

  // Set up cycling text while analyzing
  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      let index = 0;
      setLoadingStepText(statusPhrases[0]);
      interval = setInterval(() => {
        index = (index + 1) % statusPhrases.length;
        setLoadingStepText(statusPhrases[index]);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Handle validating key configs
  async function validateActiveConfiguration(isQuiet = false) {
    if (!isQuiet) {
      setIsValidating(true);
      setValidationError(null);
      setValidationSuccess(null);
    }

    try {
      // Send parameters to backend api to run live verification checks
      const keyToSend = useCustomKey ? customApiKey : "";
      
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: keyToSend }),
      });
      
      const resData = await response.json();
      
      if (resData.valid) {
        setValidationSuccess(true);
        if (resData.source === "env") {
          setIsEnvKeyAvailable(true);
        }
      } else {
        setValidationSuccess(false);
        if (!isQuiet) {
          setValidationError(resData.error || "API Key check failed.");
        }
        if (resData.source === "env") {
          setIsEnvKeyAvailable(false);
        }
      }
    } catch (err: any) {
      setValidationSuccess(false);
      if (!isQuiet) {
        setValidationError(err.message || "Failed to communicate with authorization server.");
      }
    } finally {
      if (!isQuiet) {
        setIsValidating(false);
      }
    }
  }

  // Handle saving key to localStorage
  function handleSaveKey(keyVal: string) {
    setCustomApiKey(keyVal);
    localStorage.setItem("truejob_custom_key", keyVal);
    setValidationSuccess(null);
    setValidationError(null);
  }

  // Save the custom toggles
  function handleToggleCustom(checked: boolean) {
    setUseCustomKey(checked);
    localStorage.setItem("truejob_use_custom", checked ? "true" : "false");
    setValidationSuccess(null);
    setValidationError(null);
  }

  // Reset verification states
  function handleClearKey() {
    setCustomApiKey("");
    localStorage.removeItem("truejob_custom_key");
    setValidationSuccess(null);
    setValidationError(null);
  }

  // Analyze listings API request
  async function startAdAnalysis() {
    if (!companyName.trim() || !jobTitle.trim() || !jobDescription.trim()) {
      setAnalysisError("Stated company name, job title, and job block cannot be empty.");
      return;
    }

    setAnalysisError(null);
    setScoreReport(null); // Clear previous score if re-analyzing
    setIsAnalyzing(true);

    // If sandbox preset is active, skip API processing securely to demonstrate UI workflow immediately
    if (activePresetMock) {
      setReviewedData({ ...activePresetMock.mockData });
      setGroundingSources([
        { title: `${activePresetMock.company} - Verified Enterprise Ground Record`, uri: !activePresetMock.mockData.companyUrl ? "https://google.com" : `https://${activePresetMock.mockData.companyUrl}` },
        { title: "Independent Glassdoor Directory Reference", uri: "https://glassdoor.com" },
        { title: "Opencorporates Legal Business Registrar", uri: "https://opencorporates.com" }
      ]);
      setCurrentStep(3);
      setIsAnalyzing(false);
      return;
    }

    try {
      const payload = {
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        jobDescription: jobDescription.trim(),
        customApiKey: useCustomKey ? customApiKey : null
      };

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Communication failure securely extracting metrics.");
      }

      const res = await response.json();
      if (!res.success || !res.data) {
        throw new Error("Invalid structure returned from research node.");
      }

      // Populate stage data (Step 3)
      setReviewedData({
        companyUrl: res.data.companyUrl === "undefined" ? "" : (res.data.companyUrl || ""),
        linkedinUrl: res.data.linkedinUrl === "undefined" ? "" : (res.data.linkedinUrl || ""),
        isHttps: res.data.isHttps !== undefined ? res.data.isHttps : "undefined",
        domainAge: res.data.domainAge || "undefined",
        hasNordVpnAlert: res.data.hasNordVpnAlert !== undefined ? res.data.hasNordVpnAlert : "undefined",
        linkedinBadge: res.data.linkedinBadge || "undefined",
        linkedinEmployees: res.data.linkedinEmployees || "undefined",
        hasEmployeeActivity: res.data.hasEmployeeActivity !== undefined ? res.data.hasEmployeeActivity : "undefined",
        linkedinPageCreation: res.data.linkedinPageCreation || "undefined",
        externalFootprint: res.data.externalFootprint || "undefined",
        hasNoFrictionInterview: res.data.hasNoFrictionInterview !== undefined ? res.data.hasNoFrictionInterview : "undefined",
        hasFinancialRequests: res.data.hasFinancialRequests !== undefined ? res.data.hasFinancialRequests : "undefined",
        hasGenericEmails: res.data.hasGenericEmails !== undefined ? res.data.hasGenericEmails : "undefined",
        hasUnrealisticPay: res.data.hasUnrealisticPay !== undefined ? res.data.hasUnrealisticPay : "undefined",
        hasEasyApplyRedirect: res.data.hasEasyApplyRedirect !== undefined ? res.data.hasEasyApplyRedirect : "undefined",
        flaggedSourceUrls: res.data.flaggedSourceUrls || [],
        suspiciousKeywordsFound: res.data.suspiciousKeywordsFound || [],
        evidenceNotes: res.data.evidenceNotes || "",
        scamIndicators: res.data.scamIndicators || []
      });

      setGroundingSources(res.sources || []);
      setCurrentStep(3); // Shift to editable review tab
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || "API Connection error. Verify your API Key configuration.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  // Trigger Local scoring computed calculation (Step 4)
  function runDeterministicScoring() {
    const report = computeTrustScore(reviewedData);
    setScoreReport(report);
    setCurrentStep(4);
  }

  // Reset to original Step 1 form
  function handleReset() {
    setCompanyName("");
    setJobTitle("");
    setJobDescription("");
    setScoreReport(null);
    setGroundingSources([]);
    setAnalysisError(null);
    setActivePresetMock(null);
    setCurrentStep(1);
  }

  // Load predefined preset test case to form inputs
  function loadPresetToForm(presetId: string) {
    const preset = testCases.find(c => c.id === presetId);
    if (!preset) return;

    // Clear previous reports
    setScoreReport(null);
    setAnalysisError(null);
    setReviewedData(null);
    
    setCompanyName(preset.company);
    setJobTitle(preset.role);
    setJobDescription(preset.description);

    setActivePresetMock(preset);
    setCurrentStep(1);

    if (currentPath !== "/cases") {
      navigate("/");
    }
  }

  const isConfigValid = validationSuccess === true || (isEnvKeyAvailable && !useCustomKey);
  const isInputUnlocked = isConfigValid || activePresetMock !== null;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 flex flex-col antialiased">
      
      {/* Header Bar */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-xs" id="main-header">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white font-black text-xs px-2 py-1 rounded" id="app-logo-bg">
              MVP
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900" id="main-title">True Job Post</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-zinc-100 p-1 rounded-lg self-start sm:self-center" role="navigation" id="navigation-tabs">
            <Link 
              to="/"
              onClick={() => {
                if (activePresetMock) {
                  handleReset();
                }
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 flex items-center gap-1.5 ${currentPath === "/" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-600 hover:text-zinc-900"}`}
            >
              <Briefcase className="w-4 h-4" />
              Workspace
            </Link>
            <Link 
              to="/tutorial"
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 flex items-center gap-1.5 ${currentPath === "/tutorial" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-600 hover:text-zinc-900"}`}
            >
              <PlayCircle className="w-4 h-4" />
              Tutorial
            </Link>
            <Link 
              to="/cases"
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 flex items-center gap-1.5 ${currentPath === "/cases" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-600 hover:text-zinc-900"}`}
            >
              <ShieldCheck className="w-4 h-4" />
              Real Use Cases
            </Link>
            <Link 
              to="/settings"
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 flex items-center gap-1.5 ${currentPath === "/settings" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-600 hover:text-zinc-900"}`}
            >
              <Settings className="w-4 h-4" />
              Settings
              {!isConfigValid && (
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" id="config-alert-ping" />
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8" id="primary-layout">
        
        {/* Active Key Status Info Alert (When missing configuration) */}
        {!isConfigValid && currentPath !== "/settings" && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs" id="alert-no-key">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 md:mt-0"/>
              <div>
                <h2 className="text-sm font-semibold text-amber-950">Active API Keys Unvalidated</h2>
                <p className="text-xs text-amber-800 mt-0.5">Please validate your Google Gemini API configuration keys in settings before launching automated research tasks.</p>
              </div>
            </div>
            <Link to="/settings" className="text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0 inline-block">
              Configure Configuration Now
            </Link>
          </div>
        )}

        {/* Workspace View for both exact path and RealUseCases with selected preset */}
        { (currentPath === '/' || (currentPath === '/cases' && activePresetMock)) && (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentPath === '/cases' && (
                <div className="mb-6 bg-white border border-zinc-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Testing Mode</span>
                    <span className="text-sm font-semibold text-zinc-900">Sandbox Preset Loaded</span>
                  </div>
                  <button 
                    onClick={() => { setActivePresetMock(null); handleReset(); navigate("/cases"); }} 
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors px-3 py-2 rounded shadow-sm cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to Case List
                  </button>
                </div>
              )}

              
              {/* Stepper Steps UI Process Visual */}
              <div className="mb-8 bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs" id="visual-process-stepper">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">TrueJobPost Core 4-Step Verification Workflow</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="workflow-steps-grid">
                  
                  {/* Step 1 Item */}
                  <div 
                    onClick={() => {
                       if (!isAnalyzing && (currentStep === 3 || currentStep === 4)) {
                         setCurrentStep(1);
                       }
                    }}
                    className={`p-3 rounded-lg border flex gap-3 transition-colors ${currentStep === 1 ? "bg-indigo-50 border-indigo-200" : "bg-zinc-50 border-zinc-200"} ${(!isAnalyzing && (currentStep === 3 || currentStep === 4)) ? "cursor-pointer hover:bg-zinc-100" : ""}`} id="step-info-1">
                    <span className={`w-6 h-6 shrink-0 rounded-full font-bold text-xs flex items-center justify-center ${currentStep === 1 ? "bg-indigo-600 text-white text-medium" : "bg-zinc-300 text-zinc-700"}`}>1</span>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">Input Data Collection</h4>
                      <p className="text-[11px] text-zinc-600 mt-0.5">Provide Company Name and paste the raw LinkedIn/Indeed job listing text block.</p>
                    </div>
                  </div>

                  {/* Step 2 Item */}
                  <div className={`p-3 rounded-lg border flex gap-3 ${isAnalyzing ? "bg-amber-50 border-amber-200 animate-pulse" : "bg-zinc-50 border-zinc-200"}`} id="step-info-2">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-zinc-300 text-zinc-700 font-bold text-xs flex items-center justify-center">2</span>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">Automated AI Research</h4>
                      <p className="text-[11px] text-zinc-600 mt-0.5">Gemini scans the raw signals and triggers real Google Search Grounding.</p>
                    </div>
                  </div>

                  {/* Step 3 Item */}
                  <div 
                    onClick={() => {
                       if (!isAnalyzing && reviewedData && currentStep !== 3) {
                         setCurrentStep(3);
                       }
                    }}
                    className={`p-3 rounded-lg border flex gap-3 transition-colors ${currentStep === 3 ? "bg-indigo-50 border-indigo-200" : "bg-zinc-50 border-zinc-200"} ${(!isAnalyzing && reviewedData && currentStep !== 3) ? "cursor-pointer hover:bg-zinc-100" : ""}`} id="step-info-3">
                    <span className={`w-6 h-6 shrink-0 rounded-full font-bold text-xs flex items-center justify-center ${currentStep === 3 ? "bg-indigo-600 text-white text-medium" : "bg-zinc-300 text-zinc-700"}`}>3</span>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">Human-in-the-Loop Review</h4>
                      <p className="text-[11px] text-zinc-600 mt-0.5">Interact and correct found variables yourself. Bypass hallucinations.</p>
                    </div>
                  </div>

                  {/* Step 4 Item */}
                  <div 
                    onClick={() => {
                       if (!isAnalyzing && scoreReport && currentStep !== 4) {
                         setCurrentStep(4);
                       }
                    }}
                    className={`p-3 rounded-lg border flex gap-3 transition-colors ${currentStep === 4 ? "bg-emerald-50 border-emerald-200" : "bg-zinc-50 border-zinc-200"} ${(!isAnalyzing && scoreReport && currentStep !== 4) ? "cursor-pointer hover:bg-zinc-100" : ""}`} id="step-info-4">
                    <span className={`w-6 h-6 shrink-0 rounded-full font-bold text-xs flex items-center justify-center ${currentStep === 4 ? "bg-emerald-600 text-white" : "bg-zinc-300 text-zinc-700"}`}>4</span>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">Deterministic Score Calculation</h4>
                      <p className="text-[11px] text-zinc-600 mt-0.5">Local math runs zero-trust logic providing a scoring meter (0-100) and cited audit.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Step Panels */}
              <AnimatePresence mode="wait">
                
                {/* STEP 1: Collection Interface Input Screen */}
                {currentStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="step-1-container">
                    
                    {/* Left explanation card 
                    <div className="lg:col-span-1 bg-white border border-zinc-200 rounded-xl p-6 shadow-2xs self-start" id="intro-card">
                      <h3 className="text-zinc-900 font-bold text-lg mb-2" id="intro-card-title">Say Goodbye to Recruitment Fraud</h3>
                      <p className="text-sm text-zinc-600 leading-relaxed" id="intro-card-desc">
                        Hiring fraud and spoofing attempts target millions of active remote applicants daily. Scammers clone enterprise websites, conduct fake chat-app interview workflows, and issue check-reimbursement equipment traps.
                      </p>
                      
                      <div className="mt-6 space-y-4" id="scam-checklist">
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider" id="red-flags-heading">Scam Markers Checked Automatically</h4>
                        
                        <div className="flex gap-2 text-xs text-zinc-700" id="flag-check-1">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"/>
                          <span><strong>Website Age Status:</strong> Newly registered domains vs historical corporate handles.</span>
                        </div>
                        <div className="flex gap-2 text-xs text-zinc-700" id="flag-check-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"/>
                          <span><strong>Chat-Only Channels:</strong> Routing applications via Telegram, Signal, or Skype.</span>
                        </div>
                        <div className="flex gap-2 text-xs text-zinc-700" id="flag-check-3">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"/>
                          <span><strong>Startup Gear Requests:</strong> Asking you to pay for startup laptop tech or files.</span>
                        </div>
                        <div className="flex gap-2 text-xs text-zinc-700" id="flag-check-4">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"/>
                          <span><strong>Generic Free Emails:</strong> Contact handles routing to gmail/outlook accounts.</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-zinc-100" id="safe-disclaimer">
                        <span className="text-[11px] text-zinc-500 block">
                          *All processing metrics run locally. Your pasted data remains unexposed. We maintain privacy by design in accordance with FairHire guidelines.
                        </span>
                      </div>
                    </div>
                    */}

                    {/* Right input form card */}
                    <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-6 shadow-2xs" id="input-form-card">
                      <h2 className="text-zinc-950 font-bold text-xl mb-2" id="form-heading">Analyze New Job Listing</h2>
                      <p className="text-xs text-zinc-500 mb-5">Analyze a custom job listing using our live Zero-Trust AI crawler.</p>

                      {/* Company Name Box */}
                      <div className="mb-4" id="form-inp-company-container">
                        <label htmlFor="inp-company-name" className="block text-sm font-semibold text-zinc-800 mb-1.5" id="label-company-name">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input id="inp-company-name" type="text" placeholder="e.g. Stripe, TechCorp, FairHire Labs" disabled={!isInputUnlocked || isAnalyzing} value={companyName} onChange={(e) => { setCompanyName(e.target.value); setActivePresetMock(null); }}
                          className={`w-full p-3 rounded-lg border text-sm font-medium transition-all focus:ring-2 focus:ring-indigo-600 focus:outline-none ${!isInputUnlocked ? "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed" : "bg-white border-zinc-300 text-zinc-900"}`}
                          aria-required="true"
                        />
                      </div>

                      {/* Job Title Box */}
                      <div className="mb-4" id="form-inp-title-container">
                        <label htmlFor="inp-job-title" className="block text-sm font-semibold text-zinc-800 mb-1.5" id="label-job-title">
                          Job Title <span className="text-red-500">*</span>
                        </label>
                        <input id="inp-job-title" type="text" placeholder="e.g. Senior Software Engineer" disabled={!isInputUnlocked || isAnalyzing} value={jobTitle} onChange={(e) => { setJobTitle(e.target.value); setActivePresetMock(null); }}
                          className={`w-full p-3 rounded-lg border text-sm font-medium transition-all focus:ring-2 focus:ring-indigo-600 focus:outline-none ${!isInputUnlocked ? "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed" : "bg-white border-zinc-300 text-zinc-900"}`}
                          aria-required="true"
                        />
                      </div>

                      {/* Job Description Textarea */}
                      <div className="mb-6" id="form-inp-desc-container">
                        <label htmlFor="inp-job-desc" className="block text-sm font-semibold text-zinc-800 mb-1.5" id="label-job-desc">
                          Job Description pasted text block <span className="text-red-500">*</span>
                        </label>
                        <textarea id="inp-job-desc" rows={10} placeholder="Paste the full job specification copy-pasted straight from LinkedIn, Indeed, ZipRecruiter or an email invite details block..." disabled={!isInputUnlocked || isAnalyzing} value={jobDescription} onChange={(e) => { setJobDescription(e.target.value); setActivePresetMock(null); }}
                          className={`w-full p-3 rounded-lg border text-sm font-normal leading-relaxed transition-all focus:ring-2 focus:ring-indigo-600 focus:outline-none ${!isInputUnlocked ? "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed" : "bg-white border-zinc-300 text-zinc-900"}`}
                          aria-required="true"
                        />
                      </div>

                      {analysisError && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-xs flex gap-2" id="analysis-error-banner">
                          <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                          <span>{analysisError}</span>
                        </div>
                      )}

                      {/* Launch analysis button */}
                      <div className="flex items-center justify-end gap-3 flex-wrap" id="submit-actions-panel">
                        <div className="text-xs text-zinc-500 mr-auto" id="key-source-info">
                          {activePresetMock ? (
                            <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md font-medium">
                              ✓ Sandbox Preset Active (No API needed)
                            </span>
                          ) : isConfigValid ? (
                            <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md font-medium" id="status-unlocked-badge">
                              ✓ Config Active ({useCustomKey ? "User Key" : "Server Secrets Key"})
                            </span>
                          ) : (
                            <span className="text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-md font-medium" id="status-locked-badge">
                              ⚠ Validation needed to unlock inputs
                            </span>
                          )}
                        </div>

                        {scoreReport && (
                          <button
                            onClick={() => setCurrentStep(4)}
                            className="px-6 py-3 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm whitespace-nowrap"
                          >
                            To Final Score <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                        
                        {!scoreReport && reviewedData && (
                          <button
                            onClick={() => setCurrentStep(3)}
                            className="px-6 py-3 bg-white border border-indigo-300 text-indigo-800 hover:bg-indigo-50 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm whitespace-nowrap"
                          >
                            To Review <ArrowRight className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          id="analyze-listing-btn"
                          disabled={!isInputUnlocked || isAnalyzing || !companyName.trim() || !jobTitle.trim() || !jobDescription.trim()}
                          onClick={startAdAnalysis}
                          className={`px-6 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                            !isInputUnlocked || isAnalyzing || !companyName.trim() || !jobTitle.trim() || !jobDescription.trim()
                              ? "bg-zinc-200 text-zinc-500 border border-zinc-300 cursor-not-allowed"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                          }`}
                        >
                          {isAnalyzing ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" id="spin" />
                              <span>Processing Listing Staging Check...</span>
                            </>
                          ) : (
                            <>
                              <span>{reviewedData ? "Re-Analyze Listing" : "Analyze Listing"}</span>
                              <ArrowRight className="w-4 h-4 font-bold" />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Display floating loading screen if currently analyzing listing */}
                      {isAnalyzing && (
                        <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-center animate-pulse" id="staged-checking-screen">
                          <Search className="w-8 h-8 text-indigo-600 mx-auto animate-bounce mb-3" />
                          <h4 className="text-sm font-bold text-indigo-950">Automated AI Staging Scan Underway</h4>
                          <p className="text-xs text-indigo-700 mt-1 max-w-md mx-auto" id="stage-reassure-text">{loadingStepText}</p>
                        </div>
                      )}

                    </div>
                  </motion.div>
                )}


                {/* STEP 3: Human-in-the-Loop Review Verification Dashboard */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    id="step-3-container"
                  >
                    
                    {/* Left: Metadata and Explanatory Panel for Grounding Sources */}
                    <div className="lg:col-span-1 bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs self-start" id="grounding-info-panel">
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-bold text-zinc-900 text-sm">Grounded Verification Signals</h3>
                      </div>
                      
                      <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                        Gemini searched live directories to ground this company domain name. Check the extracted records and source URLs below before you certify the audit scores.
                      </p>

                      <div className="mb-4" id="grounded-citation-panel">
                        <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Google Grounding Sources Found</h4>
                        {groundingSources.length === 0 ? (
                          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-500" id="no-grounding-citation">
                            No external citations grounded during this listing search. You may add domain parameters manually.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-52 overflow-y-auto" id="grounding-sources-list">
                            {groundingSources.map((source, index) => (
                              <a
                                key={index}
                                href={source.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-indigo-700 hover:text-indigo-800 font-semibold hover:border-indigo-300 transition-colors flex items-center justify-between"
                                id={`src-link-${index}`}
                              >
                                <span className="truncate max-w-[85%]">{source.title}</span>
                                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 leading-relaxed" id="hallucination-warning">
                        <strong className="block font-semibold mb-0.5">Hallucination Mitigation Protocol</strong>
                        Scanners can overshoot or misidentify. Verify the extracted metrics dynamically on the dashboard to the right to preserve scoring truth.
                      </div>
                    </div>

                    {/* Right: The Interactive Editable Dashboard Review Form */}
                    <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-6 shadow-2xs" id="review-dashboard-panel">
                      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-zinc-100 pb-4 mb-5" id="review-header">
                        <div>
                          <h2 className="text-zinc-950 font-bold text-xl flex items-center gap-2" id="verification-heading">
                            <Sliders className="w-5 h-5 text-indigo-600" />
                            Human-in-the-Loop Verification
                          </h2>
                          <p className="text-xs text-zinc-500 mt-1">Audit, correct, and confirm found parameters of <span className="font-bold text-zinc-700">{companyName}</span></p>
                        </div>
                        <div className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md uppercase" id="staging-label">
                          Stage 3 Dashboard review
                        </div>
                      </div>

                      {/* Interactive Audit Variables Grid */}
                      <fieldset className="space-y-6 animate-all text-left" id="audit-fieldset">
                        <legend className="sr-only">Verify and Modify Extracted Job Metrics</legend>
                        
                        {/* SECTION A: Website & Domain security controls */}
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-4" id="group-web-security">
                          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-200 pb-1.5 flex items-center gap-1.5">
                            <LinkIcon className="w-4 h-4 text-indigo-600" />
                            Group A: Website & Domain Security Profiles
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="grid-web-security">
                            {/* Domain URL input */}
                            <div id="inp-reviewed-url-container">
                              <label htmlFor="inp-reviewed-url" className="block text-xs font-bold text-zinc-700 mb-1">Corporate Domain URL</label>
                              <input
                                id="inp-reviewed-url"
                                type="text"
                                value={reviewedData.companyUrl}
                                onChange={(e) => setReviewedData({ ...reviewedData, companyUrl: e.target.value })}
                                className="w-full p-2 rounded-lg border border-zinc-300 text-xs font-mono bg-white text-zinc-950 focus:ring-2 focus:ring-indigo-605 focus:ring-indigo-600 focus:outline-none"
                                placeholder="e.g. stripe.com"
                              />
                            </div>

                            {/* HTTPS status */}
                            <div id="inp-reviewed-https-container">
                              <label htmlFor="inp-reviewed-https" className="block text-xs font-bold text-zinc-700 mb-1">Web SSL Security Protocol</label>
                              <select
                                id="inp-reviewed-https"
                                value={reviewedData.isHttps === "undefined" ? "undefined" : reviewedData.isHttps ? "true" : "false"}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setReviewedData({ ...reviewedData, isHttps: val === "undefined" ? "undefined" : val === "true" });
                                }}
                                className="w-full p-2 bg-white border border-zinc-300 text-xs font-medium rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer"
                              >
                                <option value="true">✓ SECURE HTTPS Active</option>
                                <option value="false">⚠ INSECURE HTTP Protocol</option>
                                <option value="undefined">Unknown / Unchecked</option>
                              </select>
                            </div>

                            {/* Registration Tenure */}
                            <div id="inp-reviewed-age-container">
                              <label htmlFor="inp-reviewed-age" className="block text-xs font-bold text-zinc-700 mb-1">Estimated Domain Register Age</label>
                              <select
                                id="inp-reviewed-age"
                                value={reviewedData.domainAge}
                                onChange={(e: any) => setReviewedData({ ...reviewedData, domainAge: e.target.value })}
                                className="w-full p-2 bg-white border border-zinc-300 text-xs font-medium rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer"
                              >
                                <option value="old">Old (Verified brand active 5+ years)</option>
                                <option value="mid">Mid (1 to 5 years footprint)</option>
                                <option value="new">New (Registered under 1 year or look-alike) [Danger]</option>
                                <option value="undefined">Undefined / Cannot Confirm</option>
                              </select>
                            </div>

                            {/* NordVPN Alert Flag */}
                            <div id="inp-reviewed-alert-container">
                              <label htmlFor="inp-reviewed-alert" className="block text-xs font-bold text-zinc-700 mb-1">Web Safety / Reputation Registry</label>
                              <select
                                id="inp-reviewed-alert"
                                value={reviewedData.hasNordVpnAlert === "undefined" ? "undefined" : reviewedData.hasNordVpnAlert ? "true" : "false"}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setReviewedData({ ...reviewedData, hasNordVpnAlert: val === "undefined" ? "undefined" : val === "true" });
                                }}
                                className="w-full p-2 bg-white border border-zinc-300 text-xs font-medium rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer"
                              >
                                <option value="false">✓ Domain Reputation Clear</option>
                                <option value="true">☠ Red Flag: Blacklisted/Alerted [High Risk]</option>
                                <option value="undefined">Unverified</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* SECTION B: Social Proof & Employee presence indicators */}
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-4" id="group-social-proof">
                          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-200 pb-1.5 flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-indigo-600" />
                            Group B: LinkedIn Social Proof & Workforce Presence
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="grid-social-proof">
                            {/* Verification status badge */}
                            <div id="inp-reviewed-badge-container">
                              <label htmlFor="inp-reviewed-badge" className="block text-xs font-bold text-zinc-700 mb-1">LinkedIn Corporate Verification Badge</label>
                              <select
                                id="inp-reviewed-badge"
                                value={reviewedData.linkedinBadge}
                                onChange={(e: any) => setReviewedData({ ...reviewedData, linkedinBadge: e.target.value })}
                                className="w-full p-2 bg-white border border-zinc-300 text-xs font-medium rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer"
                              >
                                <option value="verified">✓ Brand Account VERIFIED next to profile badge</option>
                                <option value="unverified">⚠ UNVERIFIED employer profile on social platform</option>
                                <option value="login_wall">Unable to Verify (Login Required)</option>
                                <option value="undefined">Undefined / Profile Missing</option>
                              </select>
                            </div>

                            {/* Associate Employee counts */}
                            <div id="inp-reviewed-employees-container">
                              <label htmlFor="inp-reviewed-employees" className="block text-xs font-bold text-zinc-700 mb-1">Active Workers linked on LinkedIn</label>
                              <select
                                id="inp-reviewed-employees"
                                value={reviewedData.linkedinEmployees}
                                onChange={(e: any) => setReviewedData({ ...reviewedData, linkedinEmployees: e.target.value })}
                                className="w-full p-2 bg-white border border-zinc-300 text-xs font-medium rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer"
                              >
                                <option value="large">Large Enterprise (&gt;50 profiles linked)</option>
                                <option value="medium">Medium Size (11 to 50 profiles)</option>
                                <option value="boutique">Boutique (1 to 10 profiles linked)</option>
                                <option value="none">☠ Red Flag: 0 employees linked [Shell Company]</option>
                                <option value="undefined">Unchecked / Absent</option>
                              </select>
                            </div>

                            {/* Organic Profile activity depth */}
                            <div id="inp-reviewed-activity-container">
                              <label htmlFor="inp-reviewed-activity" className="block text-xs font-bold text-zinc-700 mb-1">Associated Worker Profile Activity Depth</label>
                              <select
                                id="inp-reviewed-activity"
                                value={reviewedData.hasEmployeeActivity}
                                onChange={(e: any) => setReviewedData({ ...reviewedData, hasEmployeeActivity: e.target.value })}
                                className="w-full p-2 bg-white border border-zinc-300 text-xs font-medium rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer"
                              >
                                <option value="organic">✓ High organic activity (connections, active feed)</option>
                                <option value="low">⚠ Low profile / Emerging profiles</option>
                                <option value="fake">☠ Inactive placeholders / Bots / Empty Feeds</option>
                                <option value="login_wall">Unable to Verify (Login Required)</option>
                                <option value="undefined">Unverified depth</option>
                              </select>
                            </div>

                            {/* Page Creation Dates tenure */}
                            <div id="inp-reviewed-creation-container">
                              <label htmlFor="inp-reviewed-creation" className="block text-xs font-bold text-zinc-700 mb-1">Corporate LinkedIn Page Tenure History</label>
                              <select
                                id="inp-reviewed-creation"
                                value={reviewedData.linkedinPageCreation}
                                onChange={(e: any) => setReviewedData({ ...reviewedData, linkedinPageCreation: e.target.value })}
                                className="w-full p-2 bg-white border border-zinc-300 text-xs font-medium rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer"
                              >
                                <option value="historical">Historical layout page (Years old active tenure)</option>
                                <option value="recent">☠ Red Flag: Page created very recently (3-4 weeks ago) [Dangerous]</option>
                                <option value="undefined">Unverified year</option>
                              </select>
                            </div>
                          </div>

                          {/* Third-Party directories registry footprint */}
                          <div id="inp-reviewed-footprint-container" className="pt-2">
                            <label htmlFor="inp-reviewed-footprint" className="block text-xs font-bold text-zinc-700 mb-1">Independent Footprint (Glassdoor, BBB, Opencorporates legal registrations)</label>
                            <select
                              id="inp-reviewed-footprint"
                              value={reviewedData.externalFootprint}
                              onChange={(e: any) => setReviewedData({ ...reviewedData, externalFootprint: e.target.value })}
                              className="w-full p-2 bg-white border border-zinc-300 text-xs font-medium rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer"
                            >
                              <option value="found">Found (Verifiable legale registration details, Crunchbase rounds or active workers scores)</option>
                              <option value="missing">⚠ Missing (No independent state company index listings present outside social media)</option>
                              <option value="flagged">☠ CRITICAL Red Flag: Company was reported/flagged on scam trackers/Glassdoor threads</option>
                              <option value="undefined">Unchecked / Pending check</option>
                            </select>
                            {reviewedData.externalFootprint === 'flagged' && reviewedData.flaggedSourceUrls && reviewedData.flaggedSourceUrls.length > 0 && (
                              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-[11px] font-bold text-red-800 mb-1">Flagged Directory Links Found:</p>
                                <ul className="list-disc pl-4 space-y-1">
                                  {reviewedData.flaggedSourceUrls.map((link, idx) => (
                                    <li key={idx} className="text-[11px] text-red-700 break-all leading-tight">
                                      <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">🔗 {link}</a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* SECTION C: Specific scam signals checklists */}
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3" id="group-scam-checklist">
                          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-200 pb-1.5 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-indigo-600" />
                            Group C: Deceptive Onboarding & Recruitment Scam Signs
                          </h3>
                          
                          <div className="space-y-2.5" id="checklist-scam-variables">
                            {/* Chat Interview */}
                            <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-zinc-200" id="cb-chat-interview">
                              <input
                                type="checkbox"
                                id="chk-chat-interview"
                                checked={reviewedData.hasNoFrictionInterview === true}
                                onChange={(e) => setReviewedData({ ...reviewedData, hasNoFrictionInterview: e.target.checked })}
                                className="w-4.5 h-4.5 mt-0.5 rounded border-zinc-300 text-indigo-600 cursor-pointer text-indigo-600 shrink-0"
                              />
                              <div className="flex-1">
                                <label htmlFor="chk-chat-interview" className="block text-xs font-bold text-zinc-900 cursor-pointer">
                                  Rapid No-Friction Chat Interview asked
                                </label>
                                <p className="text-[10px] text-zinc-505 text-zinc-500">Recruiter holds text interview and instant offers on WhatsApp, Telegram, Signal, or Skype loops.</p>
                              </div>
                            </div>

                            {/* Financial/Startup check scam */}
                            <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-zinc-200" id="cb-financial">
                              <input
                                type="checkbox"
                                id="chk-financial"
                                checked={reviewedData.hasFinancialRequests === true}
                                onChange={(e) => setReviewedData({ ...reviewedData, hasFinancialRequests: e.target.checked })}
                                className="w-4.5 h-4.5 mt-0.5 rounded border-zinc-300 text-indigo-600 cursor-pointer text-indigo-600 shrink-0"
                              />
                              <div className="flex-1">
                                <label htmlFor="chk-financial" className="block text-xs font-bold text-zinc-900 cursor-pointer">
                                  Upfront funds required (Specialist gear purchase / Background fee checks)
                                </label>
                                <p className="text-[10px] text-zinc-505 text-zinc-500">Mentions paying for prerequisite kits or receiving laptop reimbursement paper check coupons to send vendors.</p>
                              </div>
                            </div>

                            {/* Free generic email handles */}
                            <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-zinc-200" id="cb-generic-mails">
                              <input
                                type="checkbox"
                                id="chk-generic-mails"
                                checked={reviewedData.hasGenericEmails === true}
                                onChange={(e) => setReviewedData({ ...reviewedData, hasGenericEmails: e.target.checked })}
                                className="w-4.5 h-4.5 mt-0.5 rounded border-zinc-300 text-indigo-600 cursor-pointer text-indigo-600 shrink-0"
                              />
                              <div className="flex-1">
                                <label htmlFor="chk-generic-mails" className="block text-xs font-bold text-zinc-900 cursor-pointer">
                                  Uses public free domain contact emails
                                </label>
                                <p className="text-[10px] text-zinc-505 text-zinc-500">Applicants contact recruiters via @gmail.com or @outlook.com handles instead of official brand domains.</p>
                              </div>
                            </div>

                            {/* Unrealistic Salaries */}
                            <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-zinc-200" id="cb-unrealistic-pay">
                              <input
                                type="checkbox"
                                id="chk-unreal-pay"
                                checked={reviewedData.hasUnrealisticPay === true}
                                onChange={(e) => setReviewedData({ ...reviewedData, hasUnrealisticPay: e.target.checked })}
                                className="w-4.5 h-4.5 mt-0.5 rounded border-zinc-300 text-indigo-600 cursor-pointer text-indigo-600 shrink-0"
                              />
                              <div className="flex-1">
                                <label htmlFor="chk-unreal-pay" className="block text-xs font-bold text-zinc-900 cursor-pointer">
                                  Outrageous compensation for routine/entry level responsibilities
                                </label>
                                <p className="text-[10px] text-zinc-505 text-zinc-505 text-zinc-500">Offers highly elevated compensation benchmarks ($45/hour) to bait student data or virtual helpers.</p>
                              </div>
                            </div>

                            {/* Easy Apply redirects shells */}
                            <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-zinc-200" id="cb-easyapply-redirect">
                              <input
                                type="checkbox"
                                id="chk-easyapply"
                                checked={reviewedData.hasEasyApplyRedirect === true}
                                onChange={(e) => setReviewedData({ ...reviewedData, hasEasyApplyRedirect: e.target.checked })}
                                className="w-4.5 h-4.5 mt-0.5 rounded border-zinc-300 text-indigo-600 cursor-pointer text-indigo-600 shrink-0"
                              />
                              <div className="flex-1">
                                <label htmlFor="chk-easyapply" className="block text-xs font-bold text-zinc-900 cursor-pointer">
                                  Decoy redirect / Easy Apply phish trap
                                </label>
                                <p className="text-[10px] text-zinc-505 text-zinc-500">Post redirects applicants out of safe job boards to buy credential courses or execute paid background reports.</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SECTION D: AI stated grounding log and tokens flags */}
                        <div className="space-y-3" id="group-parsed-logs">
                          {/* Commas separated editable list of suspiciousTokens */}
                          <div id="inp-keywords-container">
                            <label htmlFor="inp-keywords" className="block text-xs font-bold text-zinc-700 mb-1">Parsed System Suspicious Keywords (Commas Separated)</label>
                            <input
                              id="inp-keywords"
                              type="text"
                              value={reviewedData.suspiciousKeywordsFound.join(", ")}
                              onChange={(e) => {
                                const list = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                                setReviewedData({ ...reviewedData, suspiciousKeywordsFound: list });
                              }}
                              className="w-full p-2 rounded-lg border border-zinc-300 text-xs font-semibold bg-white text-zinc-900 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                              placeholder="WhatsApp, check, gear, Telegram"
                            />
                            <p className="text-[10px] text-zinc-500 mt-1">Found string tokens parsed inside the raw job listing specifications.</p>
                          </div>

                          {reviewedData.evidenceNotes && (
                            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3" id="evidence-panel">
                              <span className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Info className="w-3.5 h-3.5" />
                                Google Grounding Research Log (Read Only)
                              </span>
                              <p className="text-xs text-zinc-700 leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap">{reviewedData.evidenceNotes}</p>
                            </div>
                          )}

                          {reviewedData.scamIndicators.length > 0 && (
                            <div id="flagged-blocks-container">
                              <span className="block text-[11px] font-bold text-zinc-405 text-zinc-400 uppercase tracking-wider mb-1.5">Parsed listing sentences marked as scam indicators</span>
                              <div className="flex flex-col gap-1.5" id="scam-phrases-list">
                                {reviewedData.scamIndicators.map((phrase, idx) => (
                                  <div key={idx} className="text-xs bg-red-50 text-red-950 border border-red-100 rounded-lg p-2.5 font-normal leading-relaxed text-left flex items-start gap-2" id={`scam-phrase-${idx}`}>
                                    <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                    <span>&ldquo;{phrase}&rdquo;</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                      </fieldset>

                      {/* Action buttons on Review form */}
                      <div className="flex items-center justify-between gap-4 mt-8 pt-4 border-t border-zinc-100" id="review-actions-panel">
                        <button
                          id="review-back-btn"
                          onClick={() => setCurrentStep(1)}
                          className="px-4 py-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Adjust Raw Text Block
                        </button>

                        <button
                          id="review-confirm-btn"
                          onClick={runDeterministicScoring}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <span>Confirm & Run Audit</span>
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}


                {/* STEP 4: Deterministic Scoring Engine & Transparent Breakdown */}
                {currentStep === 4 && scoreReport && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-all"
                    id="step-4-container"
                  >
                    
                    {/* Score representation card and circular gauge indicator */}
                    <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-xl p-6 shadow-xs flex flex-col items-center justify-center text-center sticky top-24 self-start" id="score-meter-card">
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">TrueJobPost Score Metric</h4>
                      
                      {/* SVG Circle Gauge */}
                      <div className="relative w-44 h-44 flex items-center justify-center" id="score-circle-gauge">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          {/* Rail segment */}
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            stroke="#e4e4e7"
                            strokeWidth="8"
                            fill="transparent"
                          />
                          {/* Active score arch */}
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            stroke={
                              scoreReport.class === "safe" 
                                ? "#059669" 
                                : scoreReport.class === "warning" 
                                  ? "#d97706" 
                                  : "#dc2626"
                            }
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={263.89}
                            strokeDashoffset={263.89 - (263.89 * scoreReport.score) / 100}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>

                        {/* Center text score value */}
                        <div className="absolute flex flex-col items-center" id="gauge-numbers">
                          <span className="text-4xl font-extrabold text-zinc-900 tracking-tight" id="badge-score-value">{scoreReport.score}</span>
                          <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider" id="badge-score-caption">Audit Score</span>
                        </div>
                      </div>

                      {/* Score Level badge and narrative summary descriptor */}
                      <div className="mt-5 w-full" id="score-description-panel">
                        <span className={`inline-block text-xs font-extrabold uppercase px-3 py-1 rounded-full border ${
                          scoreReport.class === "safe" 
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                            : scoreReport.class === "warning" 
                              ? "bg-amber-50 text-amber-800 border-amber-200" 
                              : "bg-red-50 text-red-800 border-red-200"
                        }`} id="risk-status-badge">
                          {scoreReport.class === "safe" && "✓ Verifiably Secure"}
                          {scoreReport.class === "warning" && "⚠ Verification Precaution"}
                          {scoreReport.class === "danger" && "☠ Dangerous/Suspected Scam"}
                        </span>
                        
                        <p className="text-zinc-700 text-xs mt-3 leading-relaxed font-medium" id="score-narrative-summary">
                          {scoreReport.summary}
                        </p>
                      </div>

                      {/* Recount button returning to begin */}
                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => setCurrentStep(3)}
                          className="flex-1 py-3 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-800 rounded-lg text-xs font-bold font-mono transition-colors tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                        >
                          <ChevronLeft className="w-4.5 h-4.5" />
                          BACK TO REVIEW
                        </button>

                        <button
                          id="score-reset-btn"
                          onClick={handleReset}
                          className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold font-mono transition-colors tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                        >
                          <RotateCcw className="w-4.5 h-4.5" />
                          ANALYZE NEW
                        </button>
                      </div>
                    </div>

                    {/* Score Breakdown lists */}
                    <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl p-6 shadow-xs" id="score-breakdown-panel">
                      <h3 className="text-zinc-950 font-bold text-lg mb-1" id="breakdown-headline">Verification Audit Breakdown</h3>
                      <p className="text-xs text-zinc-500 mb-6">Transparent overview of factor evaluations processed locally by our Zero-Trust scoring logic.</p>

                      <div className="space-y-4" id="breakdown-items-list">
                        {scoreReport.breakdown.map((item, index) => (
                          <div 
                            key={index} 
                            className={`p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-start md:items-center ${
                              item.impact === 0 
                                ? "bg-emerald-50/45 border-emerald-100" 
                                : item.isRedFlag 
                                  ? "bg-red-50/45 border-red-100" 
                                  : "bg-amber-50/40 border-amber-100"
                            }`}
                            id={`breakdown-row-${index}`}
                          >
                            {/* Visual impact badges */}
                            <div className="shrink-0" id={`breakdown-badge-container-${index}`}>
                              {item.impact === 0 ? (
                                <span className="text-[11px] font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-md" id={`badge-ok-${index}`}>
                                  Verified OK
                                </span>
                              ) : (
                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${item.isRedFlag ? "bg-red-600 text-white" : "bg-amber-600 text-white"}`} id={`badge-dmg-${index}`}>
                                  {item.impact} pts
                                </span>
                              )}
                            </div>

                            {/* Informative notes */}
                            <div className="flex-1" id={`breakdown-notes-${index}`}>
                              <h4 className="text-zinc-900 font-bold text-sm" id={`breakdown-label-${index}`}>{item.label}</h4>
                              <p className="text-zinc-650 text-xs mt-1 leading-relaxed" id={`breakdown-notes-p-${index}`}>
                                {item.notes}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Displaying sources citation block block */}
                      {groundingSources.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-zinc-100" id="breakdown-sources-section">
                          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <LinkIcon className="w-4.5 h-4.5 text-indigo-600" />
                            Citations & Search Grounding References
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="breakdown-citations-grid">
                            {groundingSources.map((source, index) => (
                              <a
                                key={index}
                                href={source.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-lg text-xs font-medium text-zinc-800 hover:text-zinc-900 block truncate flex items-center justify-between"
                                id={`source-bullet-${index}`}
                              >
                                <span className="truncate max-w-[90%]">{source.title}</span>
                                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>

                  </motion.div>
                )}

              </AnimatePresence>
            </motion.div>
        )}

        <Routes>
          <Route path="/" element={null} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/cases" element={!activePresetMock ? <RealUseCases onLoadPreset={loadPresetToForm} /> : null} />
          <Route path="/settings" element={
            <SettingsPage 
              useCustomKey={useCustomKey}
              customApiKey={customApiKey}
              isEnvKeyAvailable={isEnvKeyAvailable}
              validationSuccess={validationSuccess}
              isValidating={isValidating}
              validationError={validationError}
              onToggleCustomKey={handleToggleCustom}
              onSaveCustomKey={handleSaveKey}
              onClearCustomKey={handleClearKey}
              onValidate={() => validateActiveConfiguration(false)}
            />
          } />
        </Routes>

      </main>

      {/* Footer information section */}
      <footer className="bg-white border-t border-zinc-200 py-6 text-center text-xs text-zinc-500 mt-auto" id="primary-footer">
        <div className="max-w-6xl w-full mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:text-left gap-1">
            <p className="font-semibold text-zinc-600" id="dev-credit">Powered by FairHire Labs • Human-in-the-Loop Engine</p>
            <p id="copyright-para">© 2026 FairHire Labs. Created for recruitment safety audit loops under open licenses.</p>
          </div>
          <div className="flex gap-4" id="footer-extra-links">
            <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 underline" id="google-external-footer-link">Google AI Studio</a>
            <span className="text-zinc-300">|</span>
            <span className="font-mono text-[10px] text-zinc-400" id="utc-clock">UTC Audit Log Tracker</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
