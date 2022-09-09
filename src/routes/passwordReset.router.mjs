import express from 'express'
import passwordReset from '../controllers/passwordReset.controller.mjs'
import apiValidateMiddleware from '../controllers/middlewares/apiValidate.middleware.mjs'
import apiRateLimit from '../controllers/middlewares/apiRateLimit.middleware.mjs'
import {
    validatePasswordReset,
    validatePasswordResetRequest,
    validateVerifyPasswordReset
} from '../controllers/validators/passwordReset.validator.mjs'
import { response } from '../utils/functions.mjs'
import { Code } from '../utils/consts.utils.mjs'
import recaptchaMiddleware from '../controllers/middlewares/recaptcha.middleware.mjs'
const router = express.Router()

router.post(
    '/request',
    apiValidateMiddleware(validatePasswordResetRequest),
    recaptchaMiddleware,
    apiRateLimit({
        max: 5,
        windowMs: 10 * 60 * 1000 /* 10 minutes */,
        keyRequestProp: 'body.email',
        info: 'forgot password request is limited to 5 requests per 10 minutes'
    }),
    apiRateLimit({
        max: 10,
        windowMs: 30 * 60 * 1000 /* 30 minutes */
    }),
    passwordReset.request
)

router.post(
    '/verify',
    apiValidateMiddleware(validateVerifyPasswordReset),
    // TODO: replace it with (slow down limit middleware)
    apiRateLimit({
        max: 100,
        windowMs: 2 * 60 * 60 * 1000 /* 2 hours */,
        keyRequestProp: 'ip'
    }),
    // Once the user opens the link, he will not be allowed to open it again
    apiRateLimit({
        max: 1,
        windowMs: 2 * 60 * 60 * 1000 /* 2 hours */,
        keyCallback: (req) => req.body.token,
        responseCallback: (req, res) =>
            response(res, {
                code: Code.PASSWORD_RESET_TOKEN_EXPIRED,
                info: {
                    token: req.body.token,
                    developer_message:
                        'token is already verified (only one attempt per token is allowed)'
                }
            })
    }),
    passwordReset.verifyToken
)

router.post(
    '/reset',
    apiValidateMiddleware(validatePasswordReset),
    apiRateLimit({
        // TODO: replace it with (slow down limit middleware)
        max: 150,
        windowMs: 1 * 60 * 60 * 1000 /* 2 hours */
    }),
    passwordReset.reset
)

export default router
