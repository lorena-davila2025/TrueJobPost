import React from 'react';
import { Shield, Key, AlertTriangle, CheckCircle } from 'lucide-react';

interface SettingsProps {
  useCustomKey: boolean;
  customApiKey: string;
  isEnvKeyAvailable: boolean;
  validationSuccess: boolean | null;
  isValidating: boolean;
  validationError: string | null;
  onToggleCustomKey: (val: boolean) => void;
  onSaveCustomKey: (val: string) => void;
  onClearCustomKey: () => void;
  onValidate: () => void;
}

export default function SettingsPage({
  useCustomKey,
  customApiKey,
  isEnvKeyAvailable,
  validationSuccess,
  isValidating,
  validationError,
  onToggleCustomKey,
  onSaveCustomKey,
  onClearCustomKey,
  onValidate
}: SettingsProps) {
  const [localInput, setLocalInput] = React.useState(customApiKey);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-zinc-900 mb-8 flex items-center gap-2">
        <Shield className="w-6 h-6 text-indigo-600" />
        Zero-Trust Integrity Settings
      </h2>

      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <Key className="w-4 h-4 text-zinc-500" />
          Google Gemini Integration Config
        </h3>

        <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 mb-6">
          <p className="text-sm text-zinc-600 leading-relaxed mb-4">
            TrueJobPost uses an AI staging step to parse parameters before the math engine takes over. You can use the standard server keys, or override it and use your own private API key right here in your browser context.
          </p>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useCustomKey}
              onChange={(e) => onToggleCustomKey(e.target.checked)}
              className="w-5 h-5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-zinc-800">Use my own Gemini API Key overrides</span>
          </label>
        </div>

        {useCustomKey ? (
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-2">Override Local Key</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="password"
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  placeholder="Paste your individual Gemini API key..."
                  className="flex-1 w-full p-2.5 rounded-lg border border-zinc-300 text-sm font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => onSaveCustomKey(localInput)}
                  className="bg-zinc-800 hover:bg-zinc-900 text-white font-semibold text-xs px-5 py-2.5 rounded-lg border-b-2 border-zinc-950 transition-colors cursor-pointer shrink-0"
                >
                  Save Local Configuration
                </button>
                <button
                  type="button"
                  onClick={() => { setLocalInput(""); onClearCustomKey(); }}
                  className="bg-white hover:bg-zinc-100 text-zinc-700 font-semibold text-xs px-5 py-2.5 rounded-lg border border-zinc-300 transition-colors cursor-pointer shrink-0"
                >
                  Clear Config
                </button>
              </div>
            </div>
            {customApiKey && (
              <p className="text-[11px] text-zinc-500 font-semibold">Local Override Active: <span className="text-emerald-700 blur-sm hover:blur-none transition-all">{customApiKey.substring(0, 8)}...</span> (Stored unencrypted in localStorage via browser only)</p>
            )}
          </div>
        ) : (
          <div className="p-4 bg-white border border-zinc-200 rounded-lg">
             <div className="flex items-center justify-between gap-4">
               <div>
                  <span className="block text-sm font-bold text-zinc-900">Standard Server Environment Configuration</span>
                  <span className={`text-[11px] font-semibold mt-1 block \${isEnvKeyAvailable ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {isEnvKeyAvailable ? "✓ Master connection keys present on Node relay tier" : "⚠ Server connection keys missing from configuration tier"}
                  </span>
               </div>
             </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <button
            type="button"
            onClick={onValidate}
            disabled={isValidating}
            className={`px-5 py-2.5 font-bold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto \${isValidating ? "bg-zinc-200 text-zinc-500 cursor-not-allowed" : "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"}`}
          >
            {isValidating ? "Validating Network Auth..." : "Run Connectivity Authentication Process"}
          </button>
          
          <div className="flex items-center gap-2">
            {validationSuccess === true && <div className="text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md text-xs font-bold border border-emerald-100 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5"/> Pipeline Configuration Verified</div>}
            {validationSuccess === false && <div className="text-red-700 bg-red-50 py-1.5 px-3 rounded-md text-xs font-bold border border-red-100 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5"/> Validation Connection Failure</div>}
          </div>
        </div>

        {validationError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs font-medium">
            <strong>Check Details:</strong> {validationError}
            {!useCustomKey && !isEnvKeyAvailable && <span className="block mt-1 text-red-950 font-bold">Try manually overriding connection configuration above by feeding a local API string.</span>}
          </div>
        )}

      </div>
    </div>
  );
}
