import express from 'express'
import ingredient from '../controllers/ingredient.controller.mjs'
import authMiddleware from '../controllers/middlewares/auth.middleware.mjs'
import objectIdMiddleware from '../controllers/middlewares/objectId.middleware.mjs'
import apiValidateMiddleware from '../controllers/middlewares/apiValidate.middleware.mjs'
import {
    validateCreateIngredient,
    validateUpdateIngredient
} from '../controllers/validators/ingredient.validator.mjs'

const router = express.Router()

router.post(
    '/',
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    apiValidateMiddleware(validateCreateIngredient),
    ingredient.create
)

router.get('/', ingredient.findAll)

router.put(
    '/:id',
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    objectIdMiddleware,
    apiValidateMiddleware(validateUpdateIngredient),
    ingredient.update
)

router.get('/:id', objectIdMiddleware, ingredient.findById)

router.delete(
    '/:id',
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    objectIdMiddleware,
    ingredient.delete
)

export default router
