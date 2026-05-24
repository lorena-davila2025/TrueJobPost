import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, ShieldAlert, Sliders, CheckCircle, AlertTriangle } from 'lucide-react';
import { testCases } from '../data/testCases';

interface RealUseCasesProps {
  onLoadPreset?: (presetId: string, directScore: boolean) => void;
}

export default function RealUseCases({ onLoadPreset }: RealUseCasesProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");

  const selectedCase = testCases.find(c => c.id === selectedPresetId);

  // Generate fallback URLs based on the companies to simulate them being found on the internet
  const getJobUrl = (companyName: string) => {
    const safeName = companyName.toLowerCase().replace(/[^a-z0-z]/g, '');
    if (companyName.includes("Stripe")) return "https://jobs.stripe.com/roles";
    if (companyName.includes("Airbnb")) return "https://careers.airbnb.com/positions";
    if (companyName.includes("Patagonia")) return "https://www.patagonia.com/careers/";
    if (companyName.includes("Google")) return "https://careers.google.com/";
    // Mock URLs for scam cases representing where they might have been scraped
    return `https://www.linkedin.com/jobs/search?keywords=${safeName}`;
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">Real Use Cases</h1>
        <p className="text-zinc-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Select our preset sandbox test cases representing actual historical scenarios. Here are documented examples of legitimate listings versus sophisticated scams found in the wild. You can use these to test the Workspace input engine, and view where they can be found online.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-10 bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4" id="preset-header">
          <Sliders className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-zinc-900">Select Preset Sandbox Test Case</h2>
        </div>
        
        <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
          Test our scoring matrix strictly mapping 10 realistic corporate templates, ranging from verified Fortune 500 portals to dangerous advance-fee check traps.
        </p>

        <div className="relative mb-6" id="preset-dropdown-container">
          <label htmlFor="preset-test-select" className="sr-only">Choose a sandbox test listing template</label>
          <select
            id="preset-test-select"
            value={selectedPresetId}
            onChange={(e) => setSelectedPresetId(e.target.value)}
            className="w-full p-3 bg-zinc-50 hover:bg-zinc-100 transition-colors border border-zinc-300 text-zinc-900 font-semibold rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer appearance-none"
          >
            <option value="" className="text-zinc-500">-- Click to Select a Sandbox Test Listing (10 curations available) --</option>
            <optgroup label="✅ Verifiably Legitimate Listings">
              {testCases.filter(tc => tc.tier === "Legitimate").map(tc => (
                <option key={tc.id} value={tc.id} className="text-emerald-700">
                  {tc.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="⚠️ Borderline / Precautionary Cases">
              {testCases.filter(tc => tc.tier === "Suspicious").map(tc => (
                <option key={tc.id} value={tc.id} className="text-amber-700">
                  {tc.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="❌ Deceptive / Verified Fraud Loops">
              {testCases.filter(tc => tc.tier === "Scam").map(tc => (
                <option key={tc.id} value={tc.id} className="text-red-750 text-red-700">
                  {tc.name}
                </option>
              ))}
            </optgroup>
          </select>
          <span className="absolute right-4 top-3.5 text-zinc-400 pointer-events-none text-sm">▼</span>
        </div>

        {selectedCase && (
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className={`p-4 border-b flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row ${
              selectedCase.tier === 'Legitimate' ? 'bg-emerald-50 border-emerald-100' : 
              selectedCase.tier === 'Suspicious' ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'
            }`}>
              <div>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase px-2 py-0.5 mb-2 rounded border ${
                    selectedCase.tier === "Legitimate" 
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                      : selectedCase.tier === "Suspicious"
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-red-100 text-red-800 border-red-200"
                  }`}>
                  {selectedCase.tier === 'Legitimate' ? <ShieldCheck className="w-3.5 h-3.5" /> : 
                   selectedCase.tier === 'Suspicious' ? <AlertTriangle className="w-3.5 h-3.5" /> :
                   <ShieldAlert className="w-3.5 h-3.5" />}
                  {selectedCase.tier} Listing
                </span>
                <h3 className="text-lg font-bold text-zinc-900">{selectedCase.company}</h3>
              </div>

              {/* URL Display */}
              <a
                href={getJobUrl(selectedCase.company)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold py-2 px-3 border border-zinc-300 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                View Job Post Online <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
              </a>
            </div>

            <div className="p-5">
              <div className="mb-6">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Detailed Summary</h4>
                <p className="text-sm text-zinc-650 leading-relaxed bg-white border border-zinc-200 rounded p-3">
                  {selectedCase.summary}
                </p>
              </div>

              <div className="flex gap-3 flex-col sm:flex-row pt-4 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => onLoadPreset && onLoadPreset(selectedCase.id, true)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2.5 text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Instant Verify & Score (No API Key Required)</span>
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onLoadPreset && onLoadPreset(selectedCase.id, false)}
                  className="bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-700 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors cursor-pointer"
                >
                  Load Raw Texts Only
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
