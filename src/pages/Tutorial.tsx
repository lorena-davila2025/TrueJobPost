import React from 'react';

export default function Tutorial() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold text-zinc-900 mb-6">How to use TrueJobPost</h1>
      <p className="text-zinc-600 mb-8 max-w-2xl text-lg">
        TrueJobPost helps you identify whether a job listing is legitimate or a scam using our AI-driven Zero-Trust crawler and deterministic scoring.
      </p>

      <div className="space-y-12">
        <section className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">1</span>
            Data Collection
          </h2>
          <p className="text-zinc-600 mb-4">
            Start by navigating to the <strong>Workspace</strong>. Paste the company name and the full job description exactly as it appears on LinkedIn, Indeed, or another job board.
          </p>
          <ul className="list-disc pl-5 text-zinc-600 space-y-2">
            <li>Ensure you copy the <em>entire</em> text, including benefits, requirements, and boilerplate.</li>
            <li>Our system uses this raw data to identify suspicious keywords and linguistic patterns.</li>
          </ul>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">2</span>
            Automated Staging & AI Analysis
          </h2>
          <p className="text-zinc-600 mb-4">
            Once you submit the text, our engine parses it out. Behind the scenes:
          </p>
          <ul className="list-disc pl-5 text-zinc-600 space-y-2">
            <li>We search Google to ground the employer's domain.</li>
            <li>We check known scam databases and look out for chat-app interview requests.</li>
            <li>We parse out whether there's a request to purchase home-office equipment (a common advance-fee scam).</li>
          </ul>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">3</span>
            Human-in-the-Loop Review
          </h2>
          <p className="text-zinc-600 mb-4">
            AI can hallucinate. That's why we put <strong>you</strong> in control before any final scoring. You'll see a dashboard with toggles and fields.
          </p>
          <p className="text-zinc-600">
            Verify the company's real URL, confirm if they use HTTPS, check their LinkedIn badge status, and manually verify any scam indicators flagged by the scanner.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">4</span>
            Deterministic Scoring
          </h2>
          <p className="text-zinc-600 mb-4">
            Click to compute the final Trust Score. This runs via a deterministic rule engine—no AI guesswork.
          </p>
          <p className="text-zinc-600">
            The final output is a 0-100 gauge showing whether the listing is a verified authentic role, a precautionary risk, or a high-probability scam.
          </p>
        </section>
      </div>
    </div>
  );
}
