import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, ShieldAlert, Sliders, CheckCircle, AlertTriangle } from 'lucide-react';
import { testCases } from '../data/testCases';
import { computeTrustScore } from '../utils/scoring';

interface RealUseCasesProps {
  onLoadPreset?: (presetId: string) => void;
}

export default function RealUseCases({ onLoadPreset }: RealUseCasesProps) {

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
          Test our scoring matrix strictly mapping realistic corporate templates, ranging from verified Fortune 500 portals to dangerous advance-fee check traps.
        </p>

        <div className="relative mb-6" id="preset-dropdown-container">
          <label htmlFor="preset-test-select" className="sr-only">Choose a sandbox test listing template</label>
          <select
            id="preset-test-select"
            value={""}
            onChange={(e) => {
               if (onLoadPreset && e.target.value) {
                  onLoadPreset(e.target.value);
               }
            }}
            className="w-full p-3 bg-zinc-50 hover:bg-zinc-100 transition-colors border border-zinc-300 text-zinc-900 font-semibold rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer appearance-none"
          >
            <option value="" className="text-zinc-500">-- Click to Select a Sandbox Test Listing --</option>
            <optgroup label="✅ Verifiably Legitimate Listings">
              {testCases.filter(tc => tc.tier === "Legitimate").map(tc => (
                <option key={tc.id} value={tc.id} className="text-emerald-700">
                  {tc.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="⚠️ Precautionary Cases">
              {testCases.filter(tc => tc.tier === "Suspicious").map(tc => (
                <option key={tc.id} value={tc.id} className="text-amber-700">
                  {tc.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="❌ Deceptive Cases">
              {testCases.filter(tc => tc.tier === "Scam").map(tc => (
                <option key={tc.id} value={tc.id} className="text-red-750 text-red-700">
                  {tc.name}
                </option>
              ))}
            </optgroup>
          </select>
          <span className="absolute right-4 top-3.5 text-zinc-400 pointer-events-none text-sm">▼</span>
        </div>

      </div>

      <div className="mt-16 text-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Documented Examples</h2>
        <p className="text-zinc-600 mt-2">See how our parameters align with historical listings processed locally by the engine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testCases.map((useCase) => {
          const scoreReport = computeTrustScore(useCase.mockData);
          const status = scoreReport.class === 'safe' ? 'Legitimate' : 
                         scoreReport.class === 'warning' ? 'Suspicious' : 'Scam';
                         
          const keySignals = scoreReport.breakdown
            .filter(item => item.impact < 0)
            .map(item => item.label)
            .slice(0, 4);

          return (
          <div key={useCase.id} className="bg-white border border-zinc-200 rounded-2xl flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className={`p-4 border-b ${status === 'Legitimate' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${status === 'Legitimate' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {status} Case
                </span>
                {status === 'Legitimate' ? <ShieldCheck className="w-5 h-5 text-emerald-600" /> : <ShieldAlert className="w-5 h-5 text-red-600" />}
              </div>
              <h2 className="text-xl font-bold text-zinc-900">{useCase.company}</h2>
              <p className="text-sm font-medium text-zinc-700">{useCase.role}</p>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <p className="text-sm text-zinc-600 leading-relaxed mb-6 flex-1">
                {useCase.summary}
              </p>

              <div className="mb-6 space-y-2">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex justify-between items-center">
                   <span>Key Signals Detected</span>
                   <span className="text-indigo-600 font-extrabold text-lg" title="Final Score">{scoreReport.score} / 100</span>
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-xs font-medium text-zinc-700 marker:text-zinc-300">
                  {useCase.mockData.suspiciousKeywordsFound && useCase.mockData.suspiciousKeywordsFound.length > 0 && (
                    <li>Phrases: {useCase.mockData.suspiciousKeywordsFound.join(", ")}</li>
                  )}
                  {keySignals.length > 0 ? keySignals.map((signal, idx) => (
                    <li key={idx}>Flag: {signal.split(':')[0]}</li>
                  )) : <li>No distinct red flags found</li>}
                </ul>
              </div>

              <a
                href={useCase.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors transition mb-2"
              >
                {status === "Scam" || status === "Suspicious" ? "View FTC Scam Info" : "Visit Company Portal"} <ExternalLink className="w-4 h-4 ml-1" />
              </a>

              <button
                type="button"
                onClick={() => onLoadPreset && onLoadPreset(useCase.id)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2.5 text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Load Sandbox Preset Into Extractor</span>
                <CheckCircle className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )})}
      </div>

    </div>
  );
}
