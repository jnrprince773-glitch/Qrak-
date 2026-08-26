# QRAK

**Your personal project command center.**

QRAK is a local-first project vault for saving, organizing, tracking and showcasing everything you build.

## Current features

- Project CRUD: create, edit and delete projects
- Statuses: Active, Idea and Completed
- Search + filters
- Pin/favorite projects
- Tech-stack tags
- GitHub + live-demo links
- Notes and next steps
- Local persistence with browser storage
- JSON vault export
- Analytics dashboard
- Responsive cyber/glass UI
- Optional encrypted cloud sync
- **QRAK AI**: project-aware AI chat powered by the OpenAI Responses API

## QRAK AI setup

The browser never receives the OpenAI API key. QRAK calls the serverless `/api/ai` endpoint, which reads the key from Vercel environment variables and sends the current vault context to the selected OpenAI model.

1. Open the QRAK project in Vercel.
2. Add an environment variable named `OPENAI_API_KEY` with an OpenAI API key.
3. Optionally set `OPENAI_MODEL`; the default is `gpt-5.4-mini`.
4. Redeploy the project.
5. Open QRAK → **QRAK AI** and start chatting.

The AI endpoint is implemented in `/api/ai.js` and uses the OpenAI Responses API. Keep API credentials server-side and never commit them to GitHub.

## Cloud Sync setup

Cloud storage requires a Vercel Blob store. Vercel Blob supports private stores and server-side access through its Blob API.

1. Connect this repository to Vercel.
2. Create a **private** Vercel Blob store and attach it to the project.
3. Make sure the project has `BLOB_READ_WRITE_TOKEN` available in its deployment environment.
4. Deploy the project.
5. Open QRAK → **Cloud sync** → **Generate new code**.
6. Keep the sync code private. Use that same code on another device to restore the vault.

QRAK encrypts the project vault in the browser with AES-GCM before uploading the payload. The server stores the encrypted payload and does not need the plaintext project data.

> The sync code is effectively the vault key. If it is lost, QRAK cannot recover the cloud vault for you.

## Development

This is a static-first app with small Vercel serverless APIs under `/api/sync` and `/api/ai`.

```bash
npm install
npm run dev
```
