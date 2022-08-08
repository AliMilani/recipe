import _ from 'lodash'
import rateLimit from 'express-rate-limit'
import { Code } from '../../utils/consts.utils.mjs'
import { response } from '../../utils/functions.mjs'

/**
 * - this (rate limit) middleware is used to limit the number of requests from the same API
 * @param {Object} options  rateLimit options
 * @param {Number} options.max  max requests per windowMs
 * @param {Number} options.windowMs  time window in milliseconds
 * @param {!String=} options.keyRequestProp property name of the request object to use as key (default: 'ip')
 * @param {!Function=} options.keyCallback callback function to use as key
 * @param {!Function=} options.responseCallback callback function to use to generate the response
 *
 * @returns {Function} rateLimit middleware
 *
 * @example
 *
 * router.use(apiRateLimit({
 *    max: 500, // 500 requests per windowMs
 *    windowMs: 15 * 60 * 1000, //15 minute
 *    keyRequestProp: 'ip', // use "req.ip" as key (default)
 *    keyCallback: (req) =>  req.headers['x-access-token'] // use req.headers['x-access-token'] as key if exists
 *    responseCallback: (req, res) => response(res, {code : Code.TOO_MANY_REQUEST, info: {developer_message: 'rate limit exceeded'}}) 
 * }))
 */
const apiRateLimit = ({ max, windowMs, keyRequestProp, keyCallback, responseCallback } = {}) => {
    if (!max || !windowMs) throw new Error('"max" and "windowMs" are required')
    return rateLimit({
        max,
        windowMs,
        keyGenerator: (req, res) =>
            keyCallback ? keyCallback(req, res) : _.get(req, keyRequestProp) || req.ip,

        handler: (req, res) =>
            responseCallback
                ? responseCallback(req, res)
                : response(res, {
                    code: Code.TOO_MANY_REQUEST,
                    info: `rate limit exceeded (${max} requests per ${windowMs / 60 / 1000 > 60
                        ? `${windowMs / 60 / 1000 / 60} hours`
                        : `${windowMs / 60 / 1000} minutes`
                        })`
                })
    })
}

export default apiRateLimit
