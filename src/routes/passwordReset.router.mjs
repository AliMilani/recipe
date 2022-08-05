import express from 'express'
import passwordReset from '../controllers/passwordReset.controller.mjs'
import apiValidateMiddleware from '../controllers/middlewares/apiValidate.middleware.mjs'
import {
    validatePasswordReset,
    validatePasswordResetRequest,
    validateVerifyPasswordReset
} from '../controllers/validators/passwordReset.validator.mjs'
const router = express.Router()

router.post('/request', apiValidateMiddleware(validatePasswordResetRequest), passwordReset.request)

router.post('/verify', apiValidateMiddleware(validateVerifyPasswordReset), passwordReset.verifyToken)

router.post('/reset', apiValidateMiddleware(validatePasswordReset), passwordReset.reset)

export default router
