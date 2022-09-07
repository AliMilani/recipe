import express from 'express'
import category from '../controllers/category.controller.mjs'
import authMiddleware from '../controllers/middlewares/auth.middleware.mjs'
import objectIdMiddleware from '../controllers/middlewares/objectId.middleware.mjs'
import apiValidateMiddleware from '../controllers/middlewares/apiValidate.middleware.mjs'
import { validateCreateCategory, validateUpdateCategory } from '../controllers/validators/category.validator.mjs'

const router = express.Router()

router.post(
    '/',
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    apiValidateMiddleware(validateCreateCategory),
    category.create
)

router.get('/', category.findAll)

router.get('/:id', objectIdMiddleware, category.findById)

router.put(
    '/:id',
    objectIdMiddleware,
    apiValidateMiddleware(validateUpdateCategory),
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    category.update
)
router.delete(
    '/:id',
    objectIdMiddleware,
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    category.delete
)

export default router
