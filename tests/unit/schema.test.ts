import { AssistRequestSchema, AssistResponseSchema } from '@/lib/schema';

describe('Validation Schemas', () => {
  describe('AssistRequestSchema', () => {
    it('should validate a valid query', () => {
      const result = AssistRequestSchema.safeParse({ query: 'My rice leaves are yellow' });
      expect(result.success).toBe(true);
    });

    it('should reject a query that is too short', () => {
      const result = AssistRequestSchema.safeParse({ query: 'Hi' });
      expect(result.success).toBe(false);
    });
  });

  describe('AssistResponseSchema', () => {
    it('should validate a complete AI response object', () => {
      const validResponse = {
        crop: 'Rice',
        issue_detected: 'Yellow leaves',
        likely_cause: 'Nitrogen deficiency',
        recommended_actions: ['Apply urea', 'Monitor water levels'],
        weather_adjustment: 'No rain expected, irrigate normally.',
        confidence_score: 'High',
      };
      const result = AssistResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });
  });
});
