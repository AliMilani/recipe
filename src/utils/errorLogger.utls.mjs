import winston from 'winston'
import 'express-async-errors'

const _levelsFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
    // winston.format.prettyPrint()
)

export default function () {
    return winston.createLogger({
        exceptionHandlers: [new winston.transports.File({ filename: './logs/exceptions.log' })],
        rejectionHandlers: [new winston.transports.File({ filename: './logs/rejections.log' })],
        transports: [
            new winston.transports.File({
                filename: './logs/combined.log',
                format: _levelsFormat,
                level: 'info'
            }),
            new winston.transports.File({
                filename: './logs/error.log',
                level: 'error',
                format: _levelsFormat
            }),
            new winston.transports.Console({
                level: process.env.NODE_ENV === 'dev' ? 'debug' : 'info',
                format: winston.format.combine(
                    process.env.NODE_ENV === 'dev'
                        ? winston.format.colorize({
                            colors: {
                                info: 'cyan'
                            }
                        })
                        : winston.format.uncolorize(),
                    process.env.NODE_ENV === 'dev'
                        ? winston.format.cli({
                            message: true
                        })
                        : winston.format.simple(),
                ),
                handleExceptions: true,
                handleRejections: true
            })
        ]
    })
}
