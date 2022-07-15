import logger from '../utils/requestLogger.utils.mjs'
import { response as res } from '../utils/functions.mjs'
export default class Controller {
    constructor() {
        this.response = res
    }

    log(req, res, next) {
        logger.info({ req })
        next()
    }
}