import errorLoggerUtls from '../utils/errorLogger.utls.mjs'
import overrideConsole from '../utils/overrideConsole.utils.mjs'

const logger = errorLoggerUtls()

overrideConsole(logger)

export default logger
