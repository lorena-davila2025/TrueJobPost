const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix classnames and htmlfor
code = code.replace(/classname=/g, 'className=');
code = code.replace(/htmlfor=/g, 'htmlFor=');

// Fix motion components and generic tags
code = code.replace(/<routes>/g, '<Routes>');
code = code.replace(/<\/routes>/g, '</Routes>');
code = code.replace(/<route /g, '<Route ');
code = code.replace(/<animatepresence /g, '<AnimatePresence ');
code = code.replace(/<\/animatepresence>/g, '</AnimatePresence>');
code = code.replace(/<playcircle /g, '<PlayCircle ');
code = code.replace(/<shieldcheck /g, '<ShieldCheck ');
code = code.replace(/<settings /g, '<Settings ');
code = code.replace(/<briefcase /g, '<Briefcase ');
code = code.replace(/<alerttriangle /g, '<AlertTriangle ');
code = code.replace(/<checkcircle /g, '<CheckCircle ');

// Fix Navigation Links
code = code.replace(
  /<link to="\/" className="\{`px-4" py-2="" text-sm="" font-medium="" rounded-md="" transition-all="" duration-150="" flex="" items-center="" gap-1\.5="" \$\{currentpath==" "="" "="" \?="" "bg-white="" text-zinc-900="" shadow-xs"="" :="" "text-zinc-600="" hover:text-zinc-900"`\}`="">/g,
  '<Link to="/" className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 flex items-center gap-1.5 ${currentPath === "/" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-600 hover:text-zinc-900"}`}>'
);
code = code.replace(
  /<link to="\/tutorial" className="\{`px-4" py-2="" text-sm="" font-medium="" rounded-md="" transition-all="" duration-150="" flex="" items-center="" gap-1\.5="" \$\{currentpath==" "="" tutorial"="" \?="" "bg-white="" text-zinc-900="" shadow-xs"="" :="" "text-zinc-600="" hover:text-zinc-900"`\}`="">/g,
  '<Link to="/tutorial" className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 flex items-center gap-1.5 ${currentPath === "/tutorial" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-600 hover:text-zinc-900"}`}>'
);
code = code.replace(
  /<link to="\/cases" className="\{`px-4" py-2="" text-sm="" font-medium="" rounded-md="" transition-all="" duration-150="" flex="" items-center="" gap-1\.5="" \$\{currentpath==" "="" cases"="" \?="" "bg-white="" text-zinc-900="" shadow-xs"="" :="" "text-zinc-600="" hover:text-zinc-900"`\}`="">/g,
  '<Link to="/cases" className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 flex items-center gap-1.5 ${currentPath === "/cases" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-600 hover:text-zinc-900"}`}>'
);
code = code.replace(
  /<link to="\/settings" className="\{`px-4" py-2="" text-sm="" font-medium="" rounded-md="" transition-all="" duration-150="" flex="" items-center="" gap-1\.5="" \$\{currentpath==" "="" settings"="" \?="" "bg-white="" text-zinc-900="" shadow-xs"="" :="" "text-zinc-600="" hover:text-zinc-900"`\}`="">/g,
  '<Link to="/settings" className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 flex items-center gap-1.5 ${currentPath === "/settings" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-600 hover:text-zinc-900"}`}>'
);
code = code.replace(/<\/Link>/ig, '</Link>'); // some were closing </Link> some </link>

// Fix injected script
code = code.replace(/<script type='text\/javascript' nonce='[^']*' src='[^']*'><\/script>/g, '');
code = code.replace(/<script type="text\/javascript" nonce="[^"]*" src="[^"]*"><\/script>/g, '');

// Fix Step workflow
code = code.replace(/className="\{`p-3" rounded-lg="" border="" flex="" gap-3="" transition-colors="" \$\{currentstep==" 1="" \?="" "bg-indigo-50="" border-indigo-200"="" :="" "bg-zinc-50="" border-zinc-200"`\}`=""/g, 'className={`p-3 rounded-lg border flex gap-3 transition-colors ${currentStep === 1 ? "bg-indigo-50 border-indigo-200" : "bg-zinc-50 border-zinc-200"}`}');
code = code.replace(/className="\{`w-6" h-6="" shrink-0="" rounded-full="" font-bold="" text-xs="" flex="" items-center="" justify-center="" \$\{currentstep==" 1="" \?="" "bg-indigo-600="" text-white="" text-medium"="" :="" "bg-zinc-300="" text-zinc-700"`\}`=""/g, 'className={`w-6 h-6 shrink-0 rounded-full font-bold text-xs flex items-center justify-center ${currentStep === 1 ? "bg-indigo-600 text-white text-medium" : "bg-zinc-300 text-zinc-700"}`}');

code = code.replace(/className="\{`p-3" rounded-lg="" border="" flex="" gap-3="" \$\{isanalyzing="" \?="" "bg-amber-50="" border-amber-200="" animate-pulse"="" :="" "bg-zinc-50="" border-zinc-200"`\}`=""/g, 'className={`p-3 rounded-lg border flex gap-3 ${isAnalyzing ? "bg-amber-50 border-amber-200 animate-pulse" : "bg-zinc-50 border-zinc-200"}`}');

code = code.replace(/className="\{`p-3" rounded-lg="" border="" flex="" gap-3="" transition-colors="" \$\{currentstep==" 3="" \?="" "bg-indigo-50="" border-indigo-200"="" :="" "bg-zinc-50="" border-zinc-200"`\}`=""/g, 'className={`p-3 rounded-lg border flex gap-3 transition-colors ${currentStep === 3 ? "bg-indigo-50 border-indigo-200" : "bg-zinc-50 border-zinc-200"}`}');
code = code.replace(/className="\{`w-6" h-6="" shrink-0="" rounded-full="" font-bold="" text-xs="" flex="" items-center="" justify-center="" \$\{currentstep==" 3="" \?="" "bg-indigo-600="" text-white="" text-medium"="" :="" "bg-zinc-300="" text-zinc-700"`\}`=""/g, 'className={`w-6 h-6 shrink-0 rounded-full font-bold text-xs flex items-center justify-center ${currentStep === 3 ? "bg-indigo-600 text-white text-medium" : "bg-zinc-300 text-zinc-700"}`}');

code = code.replace(/className="\{`p-3" rounded-lg="" border="" flex="" gap-3="" transition-colors="" \$\{currentstep==" 4="" \?="" "bg-emerald-50="" border-emerald-200"="" :="" "bg-zinc-50="" border-zinc-200"`\}`=""/g, 'className={`p-3 rounded-lg border flex gap-3 transition-colors ${currentStep === 4 ? "bg-emerald-50 border-emerald-200" : "bg-zinc-50 border-zinc-200"}`}');
code = code.replace(/className="\{`w-6" h-6="" shrink-0="" rounded-full="" font-bold="" text-xs="" flex="" items-center="" justify-center="" \$\{currentstep==" 4="" \?="" "bg-emerald-600="" text-white"="" :="" "bg-zinc-300="" text-zinc-700"`\}`=""/g, 'className={`w-6 h-6 shrink-0 rounded-full font-bold text-xs flex items-center justify-center ${currentStep === 4 ? "bg-emerald-600 text-white" : "bg-zinc-300 text-zinc-700"}`}');

// Fix Inputs
code = code.replace(/disabled="\{!isConfigValid" \|\|="" isanalyzing\}=""/g, 'disabled={!isConfigValid || isAnalyzing}');
code = code.replace(/value="\{companyName\}"/g, 'value={companyName}');
code = code.replace(/onchange="\{\(e\)" ==""> setCompanyName\(e.target.value\)\}/g, 'onChange={(e) => setCompanyName(e.target.value)}');
code = code.replace(/value="\{jobTitle\}"/g, 'value={jobTitle}');
code = code.replace(/onchange="\{\(e\)" ==""> setJobTitle\(e.target.value\)\}/g, 'onChange={(e) => setJobTitle(e.target.value)}');
code = code.replace(/value="\{jobDescription\}"/g, 'value={jobDescription}');
code = code.replace(/onchange="\{\(e\)" ==""> setJobDescription\(e.target.value\)\}/g, 'onChange={(e) => setJobDescription(e.target.value)}');
code = code.replace(/rows="\{10\}"/g, 'rows={10}');

// Remove bogus script tag that got formatted badly
code = code.replace(/<link to="\/settings" className="text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0 inline-block">/g, 
  '<Link to="/settings" className="text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0 inline-block">');

// Component name fixes
code = code.replace(/<motion.div /g, '<motion.div ');
code = code.replace(/<\/motion.div>/g, '</motion.div>');

fs.writeFileSync('src/App.tsx', code);
console.log("Fixes applied.");
