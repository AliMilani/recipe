import express from 'express'
import auth from '../controllers/auth.controller.mjs'
import authMiddleware from '../controllers/middlewares/auth.middleware.mjs'

const router = express.Router()

router.post('/signup', auth.signUp)
router.post('/signin', auth.signIn)
router.post('/logout', auth.logOut)
router.post('/refreshToken', auth.refreshToken)

export default router
