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

// Set security HTTP headers
app.use(helmet())
// Limit requests from same API
const limiter = rateLimit({
    max: 500,
    windowMs: 15 * 60 * 1000, //15 minute
    handler: function (req, res) {
        res.status(500).json({ error: 'Too many requests from this IP, please try again later.' })
        // httpContext.set('status', Code.TOO_MANY_REQUEST)
        // return response(res, {}, 'حداکثر ۵۰۰ درخواست مجاز')
    }
})
app.use('/', limiter)
// Data sanitization against NoSQL query injection
app.use(mongoSanitize())
// Data sanitization against XSS
app.use(xss())
// Prevent parameter pollution
app.use(hpp())

export default app
