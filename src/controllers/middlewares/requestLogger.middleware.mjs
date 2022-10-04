import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'

const { combine, timestamp, printf } = format

const requestLogFormat = printf(({ level, message, timestamp }) => {
    const { req, res } = message
    const err = res.err || undefined
    let text = `${timestamp} || ${err ? 'error' : 'info'} || ${res.statusCode} || ${res?.msgCode} || ${req.ip || req.ips} || ${req.hostname
        } || ${req.method} || ${req.originalUrl} || [${req.get('User-Agent')}]`

    if (err instanceof Error) {
        text += ` || ERROR: ${JSON.stringify({ message: err.message, stack: err.stack })}`
    }
    else if (err) {
        text += ' || ERROR: ' + err
    }
    return text
})

const transport = new transports.DailyRotateFile({
    filename: './logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '10m',
    maxFiles: '14d',
    prepend: true,
    format: combine(timestamp({ format: 'HH:mm:ss' }), requestLogFormat),
})

const logger = createLogger({
    format: format.json(),
    transports: [transport],
}).info


export default function (req, res, next) {
    res.on('finish', function () {
        logger({ req, res })
    })
    next()
}