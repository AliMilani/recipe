import errorLoggerUtls from './errorLogger.utls.mjs'

const logger = errorLoggerUtls(process.env.MONGODB_URI)

export default logger
