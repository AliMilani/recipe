import httpContext from 'express-http-context'
import express from 'express'
import xss from 'xss-clean'
import helmet from 'helmet'
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
app.use(express.json({ limit: '20kb' }))
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return response(res, { code: Code.JSON_SYNTAX_ERROR, info: { err } })
    }
    if (err.type === 'entity.too.large') {
        return response(res, {
            code: Code.PAYLOAD_TOO_LARGE,
            info: { err }
        })
    }
    throw err
})
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
// Reduce server fingerprinting
app.disable('x-powered-by')

app.use(indexRouter)

export default app
