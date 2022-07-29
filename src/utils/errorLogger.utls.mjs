import winston from 'winston'
import 'express-async-errors'

export default function () {
    const logger = winston.createLogger({
        exceptionHandlers: [new winston.transports.File({ filename: './logs/exceptions.log' })],
        rejectionHandlers: [new winston.transports.File({ filename: './logs/rejections.log' })]
    })

    // human readable console output
    logger.add(
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({
                    colors: {
                        info: 'cyan',
                    }
                }),
                winston.format.cli({
                    message: true
                })
            ),
            handleExceptions: true,
            handleRejections: true
        })
    )

    winston.add(new winston.transports.File({ filename: './logs/logfile.log' }))

    return logger
}
