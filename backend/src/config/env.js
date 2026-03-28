const path = require('path')
const dotenv = require('dotenv')

const envPath = path.resolve(__dirname, '..', '..', '.env')
dotenv.config({ path: envPath })

function parseList(value) {
  if (!value) {
    return []
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

const clientUrls = parseList(process.env.CLIENT_URLS)
const fallbackClientUrl = process.env.CLIENT_URL || 'http://localhost:5173'

if (clientUrls.length === 0) {
  clientUrls.push(fallbackClientUrl)
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientUrl: fallbackClientUrl,
  clientUrls,
  mongodbUri: process.env.MONGODB_URI || '',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'unsafe-default-secret',
  jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY || '1d',
  jwtCookieName: process.env.JWT_COOKIE_NAME || 'pm_access_token',
  jwtCookieSameSite: process.env.JWT_COOKIE_SAMESITE || 'lax',
  jwtCookieSecure:
    process.env.JWT_COOKIE_SECURE == null
      ? process.env.NODE_ENV === 'production'
      : process.env.JWT_COOKIE_SECURE === 'true',
}

module.exports = env
