import httpContext from 'express-http-context'
import express from 'express'
import xss from 'xss-clean'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import hpp from 'hpp'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import apiRateLimit from './controllers/middlewares/apiRateLimit.middleware.mjs'
import indexRouter from './routes/index.router.mjs'
import { Code } from './utils/consts.utils.mjs'
import { response } from './utils/functions.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()

//access req.ip
app.set('trust proxy', true)
// view engine setup
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

app.use(morgan('dev'))
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Use any third party middleware that does not need access to the context here, e.g.
app.use(httpContext.middleware)
// all code from here on has access to the same context for each request

// Set security HTTP headers
app.use(helmet())
// Limit requests from same API
app.use(
    '/',
    apiRateLimit({
        max: 500,
        windowMs: 15 * 60 * 1000 /* 15 min */
    })
)
// Data sanitization against NoSQL query injection
app.use(mongoSanitize())
// Data sanitization against XSS
app.use(xss())
// Prevent parameter pollution
app.use(hpp())

app.use(indexRouter)

app.get('/api', (req, res) => {
    res.send('API')
})

export default app
