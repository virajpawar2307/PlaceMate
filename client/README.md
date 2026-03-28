# PlaceMate Client

React + Vite frontend for PlaceMate.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

By default, API calls use `/api` in development and Vite proxies them to `http://localhost:5000`.

## Environment Variables

Copy `.env.example` to `.env` and set:

- `VITE_API_BASE_URL`: backend API base URL ending with `/api`

Examples:

- Local with Vite proxy: `VITE_API_BASE_URL=/api`
- Production (your backend): `VITE_API_BASE_URL=https://placemate-26ej.onrender.com/api`

## Vercel Deployment

1. Keep backend deployed first and verify `https://placemate-26ej.onrender.com/api/health` works.
2. In Vercel project settings, add environment variable:
	- `VITE_API_BASE_URL=https://placemate-26ej.onrender.com/api`
3. Deploy from the `client` root directory.
4. Build command: `npm run build`
5. Output directory: `dist`

`vercel.json` is included for SPA route rewrites so refresh on routes like `/discussion` works.

## Manual Build

For local verification before Vercel deploy:

```bash
npm run build
```
