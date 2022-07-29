import errorLoggerUtls from './errorLogger.utls.mjs'
import overrideConsole from './overrideConsole.utils.mjs'

const logger = errorLoggerUtls(process.env.MONGODB_URI)

overrideConsole(logger)

export default logger
