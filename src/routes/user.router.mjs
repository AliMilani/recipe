import express from 'express'
import user from '../controllers/user.controller.mjs'
import authMiddleware from '../controllers/middlewares/auth.middleware.mjs'
import objectIdMiddleware from '../controllers/middlewares/objectId.middleware.mjs'
import apiValidateMiddleware from '../controllers/middlewares/apiValidate.middleware.mjs'
import {
    validateCreateUser,
    validateUpdateUser
} from '../controllers/validators/user.validator.mjs'

const router = express.Router()
router.post(
    '/',
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    apiValidateMiddleware(validateCreateUser),
    user.create
)
router.get(
    '/id/:id',
    objectIdMiddleware,
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    user.findUserById
)
router.put(
    '/id/:id',
    objectIdMiddleware,
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    apiValidateMiddleware(validateUpdateUser),
    user.updateUserById
)
router.delete(
    '/id/:id',
    objectIdMiddleware,
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    user.deleteUserById
)
router.get('/me', authMiddleware.isAuth, user.me)

export default router
