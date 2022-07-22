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
const limiter = rateLimit({
    max: 500,
    windowMs: 15 * 60 * 1000, //15 minute
    handler: function (req, res) {
        return response(res, {
            code: Code.TOO_MANY_REQUEST,
            info: 'حداکثر ۵۰۰ درخواست مجاز'
        })
    }
})
app.use('/', limiter)
// Data sanitization against NoSQL query injection
app.use(mongoSanitize())
// Data sanitization against XSS
app.use(xss())
// Prevent parameter pollution
app.use(hpp())

app.use(indexRouter)

export default app
