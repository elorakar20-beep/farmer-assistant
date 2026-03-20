import { NextResponse } from 'next/server';
import { AssistRequestSchema } from '@/lib/schema';
import { getFarmingAdvice } from '@/lib/assistantAgent';

/**
 * POST handler for the '/api/assist' route.
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} The JSON response with AI advice or error.
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    
    // Validate request body
    const reqData = AssistRequestSchema.parse(rawBody);

    // Get farming advice via Gemini
    const advice = await getFarmingAdvice(reqData);

    return NextResponse.json(advice);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error generating advice:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid request data', details: error.issues }, { status: 400 });
    }

    const message =
      typeof error?.message === 'string' && error.message.trim().length > 0
        ? error.message
        : 'Internal Server Error';

    const status = typeof error?.status === 'number' ? error.status : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
