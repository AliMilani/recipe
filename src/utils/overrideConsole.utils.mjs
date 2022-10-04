/**
 * - Override the base global.console object with winston logger
 * @param {winston.Logger} logger
 * 
 * @returns {void} void
 */
export default function (logger) {
    if (!logger) throw new Error('logger is required')
    console.info = function () {
        return logger.info.apply(logger, arguments)
    }
    console.error = function () {
        return logger.error.apply(logger, arguments)
    }
    console.warn = function () {
        return logger.warn.apply(logger, arguments)
    }
    console.debug = function () {
        return logger.debug.apply(logger, arguments)
    }
}
