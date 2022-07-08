import logger from '../utils/logger.utils.mjs'

export default class Controller {
    constructor() {
    }

    log(req, res, next) {
        logger.info({ req })
        next()
    }
}