import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'
import 'express-async-errors'

const { combine, timestamp, printf } = format

const myFormat = printf(({ level, message, timestamp }) => {
    let { req, err, code } = message
    let ip = req.ip || req.ips
    let text = `${timestamp} ${level} ${code ? code.num : 'undefined'} ${ip} ${req.hostname
        } ${req.method} ${req.originalUrl} [${req.get('User-Agent')}]`

    if (err) {
        text += ' => ' + err + ' ' + err.stack
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
    format: combine(timestamp({ format: 'HH:mm:ss' }), myFormat),
})

const logger = createLogger({
    level: 'debug',
    format: format.json(),
    transports: [transport],
})


export default logger