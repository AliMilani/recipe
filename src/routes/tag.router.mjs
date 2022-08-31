import express from 'express'
import tag from '../controllers/tag.controller.mjs'
import authMiddleware from '../controllers/middlewares/auth.middleware.mjs'
import objectIdMiddleware from '../controllers/middlewares/objectId.middleware.mjs'
import apiValidateMiddleware from '../controllers/middlewares/apiValidate.middleware.mjs'
import { validateCreateTag, validateUpdateTag } from '../controllers/validators/tag.validator.mjs'

const router = express.Router()

router.post(
    '/',
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    apiValidateMiddleware(validateCreateTag),
    tag.create
)

router.get('/', tag.findAll)

router.get('/:id', tag.findById)

router.put(
    '/:id',
    objectIdMiddleware,
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    apiValidateMiddleware(validateUpdateTag),
    tag.update
)

router.delete(
    '/:id',
    objectIdMiddleware,
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    tag.delete
)

export default router
