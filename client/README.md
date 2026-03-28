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

By default, API calls use `/api` and Vite proxies them to `http://localhost:5000`.

## Environment Variables

Copy `.env.example` to `.env` and set:

- `VITE_API_BASE_URL`: backend API base URL ending with `/api`

Examples:

- Local with Vite proxy: `VITE_API_BASE_URL=/api`
- Production: `VITE_API_BASE_URL=https://your-backend-domain.com/api`

## Deployment Sequence

1. Deploy backend first and verify `GET /api/health` works.
2. Set frontend `VITE_API_BASE_URL` to deployed backend URL + `/api`.
3. Build and deploy frontend:

```bash
npm run build
```
