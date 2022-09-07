import express from 'express'
import recipe from '../controllers/recipe.controller.mjs'
import authMiddleware from '../controllers/middlewares/auth.middleware.mjs'
import objectIdMiddleware from '../controllers/middlewares/objectId.middleware.mjs'
import apiValidateMiddleware from '../controllers/middlewares/apiValidate.middleware.mjs'
import { validateCreateRecipe, validateUpdateRecipe } from '../controllers/validators/recipe.validator.mjs'
// import recipeModel from '../models/recipe.model.mjs'

const router = express.Router()

router.post(
    '/',
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    apiValidateMiddleware(validateCreateRecipe),
    recipe.create
)

router.get('/', recipe.get)

router.get('/search', recipe.search)

router.get('/:id', objectIdMiddleware, recipe.getById)

router.put(
    '/:id',
    objectIdMiddleware,
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    apiValidateMiddleware(validateUpdateRecipe),
    recipe.update
)

router.delete(
    '/:id',
    objectIdMiddleware,
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    recipe.delete
)


export default router
