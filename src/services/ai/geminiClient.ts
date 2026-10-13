import { Facility, Building } from '../../types/campus';
import { generateGroundedCampusAnswer, GroundedAIResponse } from './ragService';

export async function askCampusAI(
  query: string,
  facilities: Facility[],
  buildings: Building[]
): Promise<GroundedAIResponse> {
  // First, retrieve candidate grounded records to supply as evidence
  const localGrounded = generateGroundedCampusAnswer(query, facilities, buildings);

  try {
    // Attempt calling server-side Netlify Function if available
    const response = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        contextFacilities: localGrounded.matchedFacilities,
        fallbackAnswer: localGrounded.answer,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.answer) {
        return {
          answer: data.answer,
          matchedFacilities: data.matchedFacilities || localGrounded.matchedFacilities,
          clarificationOptions: data.clarificationOptions || localGrounded.clarificationOptions,
          isFallback: false,
        };
      }
    }
  } catch {
    // Netlify Functions may not be running in standard Vite dev server without netlify dev.
    // Graceful fallback to verified local RAG answer engine
  }

  // Return grounded local RAG answer adhering strictly to database facts
  return localGrounded;
}
