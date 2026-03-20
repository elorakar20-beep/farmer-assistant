# Farmer Assistant

AI-powered farming advice built with Next.js and Gemini.

## Run locally

1. Copy `.env.example` to `.env.local`.
2. Replace the placeholder value with a fresh Gemini API key in `GOOGLE_GENAI_API_KEY`.
3. Start the app with `npm run dev`.
4. Open `http://localhost:3000`.

The server reads the Gemini key from either:

- `GOOGLE_GENAI_API_KEY` for local development
- `GOOGLE_GENAI_API_KEY_FILE` for secret-file based deployments such as Cloud Run

## Cloud Run deployment

The GitHub Actions workflow in `.github/workflows/google-cloudrun-deploy.yml` is set up for a safer deployment model:

- GitHub authenticates to Google Cloud using Workload Identity Federation instead of a long-lived JSON key.
- The Gemini API key is stored in Secret Manager and mounted into Cloud Run as a file.
- The app reads that file through `GOOGLE_GENAI_API_KEY_FILE`.

Configure these before deploying:

- GitHub secret `GCP_WIF_PROVIDER`
- GitHub secret `GCP_DEPLOYER_SERVICE_ACCOUNT`
- Secret Manager secret named `google-genai-api-key`
- Secret access for the Cloud Run runtime service account via `roles/secretmanager.secretAccessor`

After updating the secret or workflow settings, redeploy the service.
