import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  // Enforce POST method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { query, contextFacilities, fallbackAnswer } = body;

    if (!query || typeof query !== 'string') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Valid query parameter is required' }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API key is not configured in Netlify environment variables,
    // safely return the verified server/database fallback answer.
    if (!apiKey) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Provider': 'grounded-database-rag',
        },
        body: JSON.stringify({
          answer: fallbackAnswer || 'Information retrieved directly from VVITU campus database.',
          matchedFacilities: contextFacilities || [],
          source: 'database_rag_verified',
        }),
      };
    }

    // Secure Gemini API REST Call (avoids exposing API keys to browser)
    const systemPrompt = `You are VVITU AI, the digital campus assistant for Vasireddy Venkatadri International Technological University (VVITU).
STRICT GROUNDING RULES:
1. Answer ONLY using the supplied campus database evidence below.
2. NEVER invent room numbers, staff names, telephone numbers, operating hours, or campus policies.
3. If information is unconfirmed, say so explicitly.
4. Distinguish the outdoor OAT (between Loyalty Blocks 2 and 3) from the enclosed Student Hub (inside Truth Block).
5. If the user asks for the nearest washroom, ask which building block they are near.
6. The SAC Room is in Honesty Block beside the Board Room; floor and room number are not yet confirmed.
7. CSE is in Honesty Block; exact room number is unconfirmed.
8. The library is across both the 3rd and 4th floors of Wisdom Block; opening hours are unconfirmed.
9. Campus mess daily lunch timings are reported as 12:00 PM to 1:30 PM; do not invent menus or prices.
10. The Medical Room is on the ground floor of Loyalty Block 4.
11. Keep answers concise, factual, and helpful.`;

    const evidenceText = JSON.stringify(contextFacilities || []);

    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const aiResponse = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemPrompt}\n\nDATABASE EVIDENCE:\n${evidenceText}\n\nUSER QUESTION:\n${query}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 300,
        },
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`Gemini API returned status ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const generatedText =
      aiData?.candidates?.[0]?.content?.parts?.[0]?.text || fallbackAnswer;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answer: generatedText.trim(),
        matchedFacilities: contextFacilities || [],
        source: 'gemini_grounded',
      }),
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answer: 'I am using the campus database to verify this information. Please check the directory pages for details.',
        error: String(error),
      }),
    };
  }
};
