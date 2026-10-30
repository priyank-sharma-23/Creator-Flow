# CreatorFlow deployment

This project has a Vite/React frontend and a FastAPI backend. Deploy them as two services.

## 1. Push this folder to GitHub

Upload the contents of this folder (not the ZIP itself) to a new GitHub repository. The `frontend/node_modules`, `frontend/dist`, and `backend/venv` folders are intentionally excluded.

## 2. Deploy the backend on Render

Create a **New + → Web Service**, connect the GitHub repository, and use:

- Root Directory: `backend`
- Runtime: `Python 3`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Health Check Path: `/api/health`

After it deploys, copy the service URL, e.g. `https://creatorflow-api.onrender.com`.

## 3. Deploy the frontend on Vercel

Import the same GitHub repository into Vercel and set:

- Root Directory: `frontend`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Add this environment variable before deploying:

- `VITE_API_URL` = your Render backend URL (without a trailing slash)

Deploy and copy your Vercel URL, e.g. `https://creatorflow.vercel.app`.

## 4. Allow the Vercel frontend to call the backend

In Render → your backend service → Environment, add:

- `CORS_ORIGINS` = your exact Vercel URL (for example `https://creatorflow.vercel.app`)

Save changes and let Render redeploy.

## Important database note

The current backend uses SQLite (`creatorflow.db`). Render's free web services have an ephemeral filesystem and can lose local SQLite changes when the service restarts, spins down, or redeploys. This is suitable for a quick college demo, but not for reliable long-term saved data. For persistent data, migrate to a managed PostgreSQL database or use a paid persistent disk.

The free Render backend may sleep after 15 minutes without traffic; its first request after sleeping can take about a minute to wake up.
