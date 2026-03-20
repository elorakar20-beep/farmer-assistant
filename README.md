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

The GitHub Actions workflow in `.github/workflows/google-cloudrun-deploy.yml` uses GitHub secrets for deployment.

Configure these before deploying:

- GitHub secret `GCP_CREDENTIALS`
- GitHub secret `GOOGLE_GENAI_API_KEY`

`GCP_CREDENTIALS` should contain your Google Cloud service account JSON key for deployment.
`GOOGLE_GENAI_API_KEY` is passed into Cloud Run as an environment variable during deployment.

After updating a secret, push to `main` again to redeploy the service.
