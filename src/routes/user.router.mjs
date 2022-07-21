import express, { application } from 'express'
import user from '../controllers/user.controller.mjs'
import authMiddleware from '../controllers/middlewares/auth.middleware.mjs'
import objectIdMiddleware from '../controllers/middlewares/objectId.middleware.mjs'

const router = express.Router()
router.post('/', authMiddleware.isAuth, authMiddleware.isAdmin, user.create)
router.get('/id/:id', objectIdMiddleware, authMiddleware.isAuth, authMiddleware.isAdmin, user.findUserById)
router.put('/id/:id', objectIdMiddleware, authMiddleware.isAuth, authMiddleware.isAdmin, user.updateUserById)
router.delete('/id/:id', objectIdMiddleware, authMiddleware.isAuth, authMiddleware.isAdmin, user.deleteUserById)
router.get('/me', authMiddleware.isAuth, user.me)


export default router
