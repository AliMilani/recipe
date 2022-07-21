import express from 'express'
import auth from '../controllers/auth.controller.mjs'
import authMiddleware from '../controllers/middlewares/auth.middleware.mjs'

const router = express.Router()

router.post('/signup', auth.signUp)
router.post('/signin', auth.signIn)

export default router
