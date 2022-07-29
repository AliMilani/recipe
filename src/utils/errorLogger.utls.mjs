import winston from 'winston'
import 'express-async-errors'

export default function () {
    const logger = winston.createLogger({
        exceptionHandlers: [new winston.transports.File({ filename: './logs/exceptions.log' })],
        rejectionHandlers: [new winston.transports.File({ filename: './logs/rejections.log' })]
    })

    winston.add(new winston.transports.File({ filename: './logs/logfile.log' }))

    return logger
}
