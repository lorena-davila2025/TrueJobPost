import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. API Route: Lightweight API key validation
  app.post("/api/validate", async (req, res) => {
    const { apiKey } = req.body;
    const finalKey = apiKey || process.env.GEMINI_API_KEY;

    if (!finalKey) {
      return res.status(200).json({
        valid: false,
        error: "No API Key provided. Set one in the settings tab or the AI Studio Secrets panel.",
        source: "none"
      });
    }

    try {
      const liveCheck = new GoogleGenAI({
        apiKey: finalKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Quick minimal check to confirm API key works
      const response = await liveCheck.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "Validate API connectivity.",
        config: {
          maxOutputTokens: 5,
        },
      });

      if (response && response.text) {
        return res.status(200).json({
          valid: true,
          source: apiKey ? "custom" : "env",
        });
      }

      return res.status(200).json({
        valid: false,
        error: "Empty response from Gemini API validate check.",
        source: apiKey ? "custom" : "env",
      });
    } catch (err: any) {
      console.error("API Key validation error:", err);
      return res.status(200).json({
        valid: false,
        error: err.message || "Invalid API key or network error during verification.",
        source: apiKey ? "custom" : "env",
      });
    }
  });

  // 2. API Route: Analyze Listing with Zero-Trust Grounding Engine
  app.post("/api/analyze", async (req, res) => {
    const { companyName, jobDescription, customApiKey } = req.body;
    const finalKey = customApiKey || process.env.GEMINI_API_KEY;

    if (!finalKey) {
      return res.status(400).json({
        error: "Missing API Key. Please provide a key in the settings panel or configure it in secrets."
      });
    }

    if (!companyName || !jobDescription) {
      return res.status(400).json({
        error: "Please provide both Company Name and Job Description raw text."
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: finalKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = 
        "You are the TrueJobPost Job Ad Crawler and Zero-Trust Verification Engine.\n" +
        "Your mission is to perform detailed research on the stated corporate identity and parse the raw job post description to flag suspicious scam vectors.\n" +
        "Crucially, if any parameter cannot be proved definitively through either your search grounding or literal text in the job ad, return it as 'undefined', 'Undefined', false, or empty list corresponding to the schema type. Avoid any hallucinations or guesses.";

      const promptText = `
Analyze the following corporate identity and raw job listing:
COMPANY NAME: "${companyName}"
JOB DESCRIPTION:
"""
${jobDescription}
"""

Please execute Google Search Grounding to evaluate:
1. companyUrl: The found official corporate website domain (e.g. stripe.com), or "undefined" if not clearly verified.
2. isHttps: Does the found company website support secure connection (HTTPS)? Return true, false, or "undefined".
3. domainAge: The domain registration tenure status:
   - "Old": Well-established company domain (5+ years old, such as Google, Stripe, etc.)
   - "Mid": Medium age domain (1-5 years old)
   - "New": Very new or highly suspicious domain (under 1 year old, or recently registered lookalike domains)
   - "Undefined": Cannot find or prove age.
4. hasNordVpnAlert: Does your search grounding or threat registry checks signal suggest this company domain has been flagged, banned, blacklisted, or associated with high-risk spam/scam campaigns or malicious proxy vectors? Return true, false, or "undefined".
5. linkedinBadge: Find the company on LinkedIn through search grounding. Does it have a grey or blue "verified" organization badge next to its profile name? Return "verified", "unverified", or "undefined".
6. linkedinEmployees: Does the LinkedIn company page show associated workers? Return "none" (zero linked workers), "few" (1 to 5 linked workers), "many" (5+ associated workers), or "undefined".
7. hasEmployeeActivity: Click or evaluate employee profile depth. Do associated employee profiles appear active with real connections (>100) and posts, or do they look like inactive placeholders/bots/generic headshots with blank feeds? Return true (active/organic depth), false (inactive placeholders/bots), or "undefined".
8. linkedinPageCreation: Look up company page tenure info. Was the LinkedIn page created very recently (e.g., "recent" if under 2 months or created within weeks), or is it "established" (years old)? Return "recent", "established", or "undefined".
9. externalFootprint: Search the business identity on independent directories like Glassdoor reviews, Crunchbase, the Better Business Bureau (BBB), or local government business registries (such as opencorporates.com). Return:
   - "robust": Clear verifiable history of funding rounds, positive reviews, or registrars
   - "missing": No independent database signs outside their own temporary page
   - "flagged": Active warnings or reports on scam trackers or Glassdoor reviews
   - "undefined": Unknown/unverified
10. hasNoFrictionInterview: Does the post/process imply immediate recruitment decisions or interview loops conducted over quick text-chat apps (WhatsApp, Telegram, Skype, Signal) without live video? Return true, false, or "undefined".
11. hasFinancialRequests: Does the job post require candidates to make any payments (background check fees, training materials), buy gift cards/laptop packages, or expect to deposit digital check handouts? Return true, false, or "undefined".
12. hasGenericEmails: Does it instruct candidates to contact or submit application details to a generic/free email service (e.g. gmail.com, outlook.com, protonmail.com, yahoo.com) instead of an official company email address? Return true, false, or "undefined".
13. hasUnrealisticPay: Does the post promise unusually high financial rewards for basic general duties (e.g. $45/hour for work-from-home data entry tasks/virtual helper)? Return true, false, or "undefined".
14. hasEasyApplyRedirect: Does the application link bypass standard ATS filters and divert candidates to suspicious portals forcing paid training subscriptions, quizzes, or background credentials checks? Return true, false, or "undefined".

List any suspicious string tokens found in 'suspiciousKeywordsFound'. Provide a short, professional, and clear 'evidenceNotes' describing what was found. List any specific suspicious text blocks in 'scamIndicators'.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              companyUrl: {
                type: Type.STRING,
                description: "The found official corporate website domain (e.g. stripe.com), or 'undefined' if not clearly verified."
              },
              isHttps: {
                type: Type.STRING,
                description: "Website secure status indicator: true, false, or 'undefined'."
              },
              domainAge: {
                type: Type.STRING,
                description: "Extracted domain age status: 'New', 'Mid', 'Old', or 'Undefined'."
              },
              hasNordVpnAlert: {
                type: Type.STRING,
                description: "Domain reputation/threat alert: true, false, or 'undefined'."
              },
              linkedinBadge: {
                type: Type.STRING,
                description: "LinkedIn company verification status: 'verified', 'unverified', or 'undefined'."
              },
              linkedinEmployees: {
                type: Type.STRING,
                description: "LinkedIn associate workers profile density: 'none', 'few', 'many', or 'undefined'."
              },
              hasEmployeeActivity: {
                type: Type.STRING,
                description: "Real employer activity depth indicator: true, false, or 'undefined'."
              },
              linkedinPageCreation: {
                type: Type.STRING,
                description: "LinkedIn page creation date age status: 'recent', 'established', or 'undefined'."
              },
              externalFootprint: {
                type: Type.STRING,
                description: "Third party directories presence status: 'robust', 'missing', 'flagged', or 'undefined'."
              },
              hasNoFrictionInterview: {
                type: Type.STRING,
                description: "Does hiring pipeline use chat app interviews: true, false, or 'undefined'."
              },
              hasFinancialRequests: {
                type: Type.STRING,
                description: "Scammer equipment/check/material fee requests: true, false, or 'undefined'."
              },
              hasGenericEmails: {
                type: Type.STRING,
                description: "Uses general emails for recruitment: true, false, or 'undefined'."
              },
              hasUnrealisticPay: {
                type: Type.STRING,
                description: "Presents outrageously high hourly rate decoy: true, false, or 'undefined'."
              },
              hasEasyApplyRedirect: {
                type: Type.STRING,
                description: "Fake shell post redirecting to paid subscription training/credit checks: true, false, or 'undefined'."
              },
              suspiciousKeywordsFound: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of malicious tokens found: 'WhatsApp', 'Telegram', 'check', 'Signal', 'Skype', 'equipment'."
              },
              evidenceNotes: {
                type: Type.STRING,
                description: "Detailed bulleted summary of research outcomes found via search grounding and text analysis."
              },
              scamIndicators: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exact diagnostic text fragments extracted from the job description triggering caution."
              }
            },
            required: [
              "companyUrl",
              "isHttps",
              "domainAge",
              "hasNordVpnAlert",
              "linkedinBadge",
              "linkedinEmployees",
              "hasEmployeeActivity",
              "linkedinPageCreation",
              "externalFootprint",
              "hasNoFrictionInterview",
              "hasFinancialRequests",
              "hasGenericEmails",
              "hasUnrealisticPay",
              "hasEasyApplyRedirect",
              "suspiciousKeywordsFound",
              "evidenceNotes",
              "scamIndicators"
            ]
          }
        }
      });

      const text = response.text || "{}";
      const cleanedText = text.trim();
      let parseResult;
      try {
        parseResult = JSON.parse(cleanedText);
        
        // Normalize boolean strings from JSON Schema helper definitions to proper runtime flags
        if (parseResult.isHttps === "true") parseResult.isHttps = true;
        if (parseResult.isHttps === "false") parseResult.isHttps = false;
        if (parseResult.hasNordVpnAlert === "true") parseResult.hasNordVpnAlert = true;
        if (parseResult.hasNordVpnAlert === "false") parseResult.hasNordVpnAlert = false;
        if (parseResult.hasEmployeeActivity === "true") parseResult.hasEmployeeActivity = true;
        if (parseResult.hasEmployeeActivity === "false") parseResult.hasEmployeeActivity = false;
        if (parseResult.hasNoFrictionInterview === "true") parseResult.hasNoFrictionInterview = true;
        if (parseResult.hasNoFrictionInterview === "false") parseResult.hasNoFrictionInterview = false;
        if (parseResult.hasFinancialRequests === "true") parseResult.hasFinancialRequests = true;
        if (parseResult.hasFinancialRequests === "false") parseResult.hasFinancialRequests = false;
        if (parseResult.hasGenericEmails === "true") parseResult.hasGenericEmails = true;
        if (parseResult.hasGenericEmails === "false") parseResult.hasGenericEmails = false;
        if (parseResult.hasUnrealisticPay === "true") parseResult.hasUnrealisticPay = true;
        if (parseResult.hasUnrealisticPay === "false") parseResult.hasUnrealisticPay = false;
        if (parseResult.hasEasyApplyRedirect === "true") parseResult.hasEasyApplyRedirect = true;
        if (parseResult.hasEasyApplyRedirect === "false") parseResult.hasEasyApplyRedirect = false;

      } catch (jsonErr) {
        console.warn("JSON parsing failed for content:", cleanedText);
        parseResult = {
          companyUrl: "undefined",
          isHttps: "undefined",
          domainAge: "Undefined",
          hasNordVpnAlert: "undefined",
          linkedinBadge: "undefined",
          linkedinEmployees: "undefined",
          hasEmployeeActivity: "undefined",
          linkedinPageCreation: "undefined",
          externalFootprint: "undefined",
          hasNoFrictionInterview: "undefined",
          hasFinancialRequests: "undefined",
          hasGenericEmails: "undefined",
          hasUnrealisticPay: "undefined",
          hasEasyApplyRedirect: "undefined",
          suspiciousKeywordsFound: [],
          evidenceNotes: "Parsing failed. Raw result: " + cleanedText,
          scamIndicators: []
        };
      }

      // Extract search grounding metadata sources if available to return to the client
      const sources: any[] = [];
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        for (const chunk of groundingChunks) {
          if (chunk.web?.uri) {
            sources.push({
              title: chunk.web.title || "Search Result",
              uri: chunk.web.uri
            });
          }
        }
      }

      return res.status(200).json({
        success: true,
        data: parseResult,
        sources
      });

    } catch (err: any) {
      console.error("Gemini job analysis error:", err);
      return res.status(500).json({
        error: err.message || "An error occurred while analyzing the listing."
      });
    }
  });

  // Serve static assets and handle SPA routing
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
