const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeBug(title, description) {
  const prompt = `
Analyze this software bug report.

Title: ${title}
Description: ${description}

Return a JSON object with these fields:
{
  "category": "UI, Backend, Database, Security, or Performance",
  "priority": "Low, Medium, High, or Critical",
  "severity": "Low, Medium, High, or Critical",
  "reason": "Brief explanation",
  "suggestedFix": "Suggested fix"
}

Return only valid JSON.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text);
}

module.exports = { analyzeBug };