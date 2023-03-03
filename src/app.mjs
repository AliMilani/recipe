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
import recaptcha from './controllers/middlewares/recaptcha.middleware.mjs'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()
// load swagger documetation
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'))
const options = {
    swaggerOptions: {
        syntaxHighlight: {
            activated: true,
            theme: 'tomorrow-night'
        },
        persistAuthorization: true,
        displayRequestDuration: true,
        // onComplete: function (hell) {
        //     window.app = hell
        // },
        // requestInterceptor: function (request) {
        //     console.log('request', request)
        //     console.log(request.headers.get('x-access-token'));
        //     return request
        // }
        responseInterceptor: function (response) {
            // FIXME: When the request status is 201 or 200, the token is lost
            try {
                // console.log(response.url, !response.url.includes('auth/signin'))
                // console.log(
                //     response.status,
                //     response.status === 201 || response.status === 200,
                //     typeof response.status
                // )
                if (
                    // !(response.status === 200 || response.status === 201) &&
                    !response.url.includes('auth/signin')
                )
                    return response
                const accessToken = response.headers['x-access-token']
                console.log(response, accessToken)
                if (!accessToken) return response 
                let oldAuth = JSON.parse(localStorage.getItem('authorized'))
                if (oldAuth && oldAuth.accessToken) {
                    oldAuth.accessToken.value = accessToken
                    localStorage.setItem('authorized', JSON.stringify(oldAuth))
                } else {
                    const newAuth = {
                        accessToken: {
                            name: 'accessToken',
                            schema: {
                                type: 'apiKey',
                                description:
                                    'you can get this token from /auth/login endpoint at the response header',
                                name: 'x-access-token',
                                in: 'header'
                            },
                            value: `${accessToken}`
                        }
                    }
                    localStorage.setItem('authorized', JSON.stringify(newAuth))
                }
                ui.authActions.authorize({
                    accessToken: {
                        name: 'accessToken',
                        schema: {
                            type: 'apiKey',
                            in: 'header',
                            name: 'x-access-token',
                            description:
                                'you can get this token from /auth/login endpoint at the response header'
                        },
                        value: accessToken
                    }
                })
            } catch (err) {
                console.error(err)
            }

            return response
        },
        deepLinking: true
    },
    // onComplete: function (swaggerApi, swaggerUi) {
    //     // window.swaggerApi = swaggerApi;
    // },
    customCssUrl: '/docs/style.css',
    customJs: '/docs/script.js'
}
// if (process.env.NODE_ENV == 'dev') swaggerDocument.host = `localhost:${process.env.PORT}`
// swaggerDocument.servers[0].url = `http://localhost:${process.env.PORT}`
app.use(
    '/api-docs',
    function (req, res, next) {
        let newDevServer = `http://${req.get('host')}`
        console.log(swaggerDocument.servers)
        if (!swaggerDocument.servers.map((server) => server.url).includes(newDevServer))
            swaggerDocument.servers.unshift({ url: `http://${req.get('host')}` })

        req.swaggerDoc = swaggerDocument
        next()
    },
    swaggerUi.serve,
    swaggerUi.setup(null, options)
)

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
