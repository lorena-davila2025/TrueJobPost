<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

## Inspiration
Besides the important fact that this was the theme of the Hackathon by Scale without Borders, it is a problem that as an immigrant I face everyday when applying for jobs. Specially when I don't know the Canadian Job market as well, and most of the companies are not familiar to me. This was a process that I have been doing since I started applying here for some of the listings.
## What it does
It scores the given job post based on a series of carefully thought out requirements, such as the Company Linkedin, company website, team workforce, third party reviews or web reputation, official company contacts provided, etc
## How we built it
Using Google Studio, and also Gemini chat for some revisions and extra debate.
## Challenges we ran into
Obtaining the Company data from Linkedin was a challenge. Attempted using LLM to perform a Google search and fetch that data, but ran into a Login wall when trying to access data such as the Company verification badge, which was not shown for the LLM or in an incognito tab versus when I was logged in that the badge was there.
Another issue was having to rephrase the prompts several times, due to the LLM in Google AI Studio not fully understanding  the most important functionalities. It was necessary to write the same idea, and then rephrase in the same prompt to make sure it was understood
## Accomplishments that we're proud of

## What we learned
To use the Human in the Loop Architecture, how even when asking the AI to perform Google Searches, different results arise each time, for this case it was decided to stop and show the data that the LLM had retrieved to be more aware about this.
## What's next for True Job Post
Research how to better imitate the steps I would take to research a company in a limited way, so the results from doing this are the same each time the search is executed.



# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ec2e085f-ca4d-4ea9-9b4c-f09be696f078

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
