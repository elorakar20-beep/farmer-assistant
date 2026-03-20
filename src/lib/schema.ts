import { z } from 'zod';

/**
 * Validates the incoming request body containing the user's text query.
 */
export const AssistRequestSchema = z.object({
  query: z.string().min(5).max(1000, "Query cannot exceed length of 1000 limit"),
  image: z.string().optional(), // Expected base64 data URI
  location: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional()
});

/**
 * Validates the structured response expected from the AI agent.
 */
export const AssistResponseSchema = z.object({
  crop: z.string(),
  issue_detected: z.string(),
  likely_cause: z.string(),
  recommended_actions: z.array(z.string()),
  weather_adjustment: z.string(),
  confidence_score: z.string(),
});

export type AssistRequest = z.infer<typeof AssistRequestSchema>;
export type AssistResponse = z.infer<typeof AssistResponseSchema>;
