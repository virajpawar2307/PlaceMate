const compression = require('compression')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')
const rateLimit = require('express-rate-limit')

const env = require('./config/env')
const errorHandler = require('./middlewares/errorHandler')
const notFound = require('./middlewares/notFound')
const routes = require('./routes')
const ApiResponse = require('./utils/ApiResponse')

const app = express()

app.set('trust proxy', 1)

const allowedOrigins = new Set(env.clientUrls)

app.use(helmet())
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true)
        return
      }

      callback(null, false)
    },
    credentials: true,
  }),
)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)
app.use(compression())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(cookieParser())
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.get('/', (req, res) => {
  res.status(200).json(
    new ApiResponse(200, 'PlaceMate backend is running', {
      health: '/api/health',
      apiBase: '/api/v1',
    }),
  )
})

app.get('/health', (req, res) => {
  res.redirect(302, '/api/health')
})

app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

module.exports = app
