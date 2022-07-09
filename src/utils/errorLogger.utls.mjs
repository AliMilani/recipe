import winston from 'winston'
import 'winston-mongodb'
import 'express-async-errors'

export default function (mongoURL) {
    winston.createLogger({
        exceptionHandlers: [
            new winston.transports.File({ filename: './logs/exceptions.log' }),
            new winston.transports.MongoDB({
                db: mongoURL,
                collection: 'log_exceptions'
            })
        ]
    })

    winston.add(new winston.transports.File({ filename: './logs/logfile.log' }))
    winston.add(new winston.transports.MongoDB({ db: mongoURL }))
}
