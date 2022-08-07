import express from 'express'
import auth from '../controllers/auth.controller.mjs'
import apiValidateMiddleware from '../controllers/middlewares/apiValidate.middleware.mjs'
import apiRateLimit from '../controllers/middlewares/apiRateLimit.middleware.mjs'
import { validateUserByPass } from '../controllers/validators/user.validator.mjs'
import { validateRefreshToken } from '../controllers/validators/token.validator.mjs'

const router = express.Router()

router.post(
    '/signup',
    apiValidateMiddleware(validateUserByPass),
    apiRateLimit({
        windowMs: 15 * 60 * 1000 /* 15 minutes */,
        max: 20
    }),
    apiRateLimit({
        windowMs: 5 * 60 * 60 * 1000 /* 5 hour */,
        max: 100
    }),
    auth.signUp
)
router.post(
    '/signin',
    apiValidateMiddleware(validateUserByPass),
    apiRateLimit({
        windowMs: 15 * 60 * 1000 /* 15 minutes */,
        max: 30
    }),
    apiRateLimit({
        windowMs: 2 * 60 * 60 * 1000 /* 2 hour */,
        max: 100
    }),
    auth.signIn
)
router.post('/logout', auth.logOut)
router.post('/refreshToken', apiValidateMiddleware(validateRefreshToken), auth.refreshToken)

export default router
