import { readFile } from 'fs/promises';
import { GoogleGenAI } from '@google/genai';
import { getMockWeather, getMockSoil } from './mockServices';
import { AssistResponse, AssistRequest } from './schema';

async function resolveGoogleGenAiApiKey(): Promise<string> {
  const directKey = process.env.GOOGLE_GENAI_API_KEY?.trim();
  if (directKey) {
    return directKey;
  }

  const secretFile = process.env.GOOGLE_GENAI_API_KEY_FILE?.trim();
  if (secretFile) {
    const fileKey = (await readFile(secretFile, 'utf8')).trim();
    if (fileKey) {
      return fileKey;
    }
  }

  throw new Error(
    'Google GenAI API key is missing. Set GOOGLE_GENAI_API_KEY locally or mount a secret file and set GOOGLE_GENAI_API_KEY_FILE.',
  );
}

/**
 * Core workflow for the Farmer Assistant agent.
 * @param {AssistRequest} request - The structured user request
 * @returns {Promise<AssistResponse>} Structured advice
 */
export async function getFarmingAdvice({ query, image, location }: AssistRequest): Promise<AssistResponse> {
  const apiKey = await resolveGoogleGenAiApiKey();
  const ai = new GoogleGenAI({ apiKey });

  // 1. Get mock/live external signals
  const weather = await getMockWeather(location);
  const soil = getMockSoil();

  // 2. Prepare structured reasoning prompt
  const prompt = `
You are an expert AI Farmer Assistant giving actionable farming advice.
The user reported the following situation: "${query}"

Here is the current environmental data you MUST consider:
- Weather: Rain expected = ${weather.rain_expected}, Humidity = ${weather.humidity}, Temp = ${weather.temperature}
- Soil: Moisture = ${soil.moisture}, pH = ${soil.ph}

Decision Rules:
- If rain is expected, strongly advise to reduce or stop irrigation in the weather_adjustment.
- If yellow leaves and rice are mentioned, diagnose as likely nitrogen deficiency and suggest urea application.
- If pest keywords are found, suggest specific treatment and preventive action.
- Always include Diagnosis, Action steps, and Preventive tips.
- If an image is provided, thoroughly analyze it to confirm or enhance your diagnosis.

Analyze the query, imagery (if any), and context, then output a structured JSON response matching the required schema. Ensure recommendations are specific and practical.
`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contentsParts: any[] = [prompt];

  if (image) {
    const match = image.match(/^data:(image\/[a-zA-Z-]*);base64,(.*)$/);
    if (match) {
      contentsParts.unshift({
        inlineData: {
          mimeType: match[1],
          data: match[2]
        }
      });
    }
  }

  // 3. Call Gemini with structured JSON output enabled
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contentsParts,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          crop: { type: 'STRING' },
          issue_detected: { type: 'STRING' },
          likely_cause: { type: 'STRING' },
          recommended_actions: { type: 'ARRAY', items: { type: 'STRING' } },
          weather_adjustment: { type: 'STRING' },
          confidence_score: { type: 'STRING' },
        },
        required: ['crop', 'issue_detected', 'likely_cause', 'recommended_actions', 'weather_adjustment', 'confidence_score'],
      },
      temperature: 0.1, // Low temperature for deterministic output
    },
  });

  const content = response.text;
  if (!content) {
    throw new Error('Failed to generate content from AI');
  }

  // Ensure parsing matches TS schema
  return JSON.parse(content) as AssistResponse;
}
