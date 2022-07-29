import express from 'express'
import auth from '../controllers/auth.controller.mjs'
import apiValidateMiddleware from '../controllers/middlewares/apiValidate.middleware.mjs'
import { validateUserByPass } from '../controllers/validators/user.validator.mjs'
import { validateRefreshToken } from '../controllers/validators/token.validator.mjs'

const router = express.Router()

router.post('/signup', apiValidateMiddleware(validateUserByPass), auth.signUp)
router.post('/signin', apiValidateMiddleware(validateUserByPass), auth.signIn)
router.post('/logout', auth.logOut)
router.post('/refreshToken', apiValidateMiddleware(validateRefreshToken), auth.refreshToken)

export default router
