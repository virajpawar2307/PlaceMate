# PlaceMate Backend

Express + MongoDB backend for the PlaceMate campus placement platform.

## Quick Start

1. Copy `.env.example` to `.env`
2. Update values for your environment
3. Install and run:

```bash
npm install
npm run dev
```

Default local URL: `http://localhost:5000`

## Environment Variables

- `NODE_ENV`: `development` or `production`
- `PORT`: backend port
- `MONGODB_URI`: MongoDB connection string
- `CLIENT_URL`: fallback single frontend origin (kept for backward compatibility)
- `CLIENT_URLS`: comma-separated allowed frontend origins for CORS
- `JWT_ACCESS_SECRET`: access token signing secret
- `JWT_ACCESS_EXPIRY`: token expiry (example: `1d`)
- `JWT_COOKIE_NAME`: auth cookie name
- `JWT_COOKIE_SAMESITE`: `lax`, `strict`, or `none`
- `JWT_COOKIE_SECURE`: `true` or `false`

## Deployment Notes

1. Deploy backend first.
2. Set `CLIENT_URLS` to every frontend domain that should call this API.
3. For cross-site cookie usage, use:
	- `JWT_COOKIE_SAMESITE=none`
	- `JWT_COOKIE_SECURE=true`
4. Verify health endpoint after deploy: `GET /api/health`

## API Routes

- Health: `/api/health`
- Versioned API: `/api/v1`
