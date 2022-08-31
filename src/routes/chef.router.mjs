import express from 'express'
import chef from '../controllers/chef.controller.mjs'
import authMiddleware from '../controllers/middlewares/auth.middleware.mjs'
import objectIdMiddleware from '../controllers/middlewares/objectId.middleware.mjs'
import apiValidateMiddleware from '../controllers/middlewares/apiValidate.middleware.mjs'
import { validateCreateChef, validateUpdateChef } from '../controllers/validators/chef.validator.mjs'

const router = express.Router()

router.post(
    '/',
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    apiValidateMiddleware(validateCreateChef),
    chef.create
)

router.get('/', chef.findAll)

router.put(
    '/:id',
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    apiValidateMiddleware(validateUpdateChef),
    chef.update
)

router.get('/:id', objectIdMiddleware, chef.findById)

router.delete(
    '/:id',
    objectIdMiddleware,
    authMiddleware.isAuth,
    authMiddleware.isAdmin,
    chef.delete
)

export default router
