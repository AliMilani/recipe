import express from 'express'
import subCategory from '../controllers/subCategory.controller.mjs'
import authMiddleware from '../controllers/middlewares/auth.middleware.mjs'
import objectIdMiddleware from '../controllers/middlewares/objectId.middleware.mjs'
import apiValidateMiddleware from '../controllers/middlewares/apiValidate.middleware.mjs'
import {
    validateCreateSubCategory,
    validateUpdateSubCategory
} from '../controllers/validators/subCategory.validator.mjs'

const router = express.Router()

router.post(
    '/',
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    apiValidateMiddleware(validateCreateSubCategory),
    subCategory.create
)

router.get('/', subCategory.findAll)

router.get('/:id', objectIdMiddleware, subCategory.findById)

router.put(
    '/:id',
    objectIdMiddleware,
    apiValidateMiddleware(validateUpdateSubCategory),
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    subCategory.update
)
router.delete(
    '/:id',
    objectIdMiddleware,
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    subCategory.delete
)

export default router
