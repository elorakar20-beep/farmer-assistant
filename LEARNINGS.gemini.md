# Farmer Assistant MVP - Learnings

## Technical Decisions
1. **Next.js App Router Setup**
   - We utilized the App Router in Next.js to colocate the React frontend with a server-side API Route (`/api/assist`), ideal for a fast monolithic Hackathon MVP while securing API Keys strictly on the backend.
   - We maintained a strict boundary per the PRAR standard by wrapping all validation tasks via Zod (`AssistRequestSchema`, `AssistResponseSchema`) before reaching the core logic.

2. **Integration of the Google GenAI SDK**
   - The `@google/genai` library was seamlessly utilized over the Gemini SDK to formulate deterministic structured JSON rules. Providing a direct JSON schema object into the generation config via `responseSchema` was extremely robust and yielded predictable results across mock simulations, completely eliminating manual string parsing logic.

3. **Validation & State Management**
   - Simple React `useState` sufficed for managing form state without heavy overhead.

## Potential Next Steps
- Implementing image uploads (using Gemini Vision).
- Migrating the mock backend services to actual live APIs (via OpenWeather/Agri APIs).
- Adding full CI/CD deployment logic to Cloud Run or Vercel.
