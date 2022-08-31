import express from 'express'
import cors from 'cors'
import errorMiddleware from '../controllers/middlewares/error.middleware.mjs'
import Controller from '../controllers/controller.mjs'
import authRouter from './auth.router.mjs'
import userRouter from './user.router.mjs'
import passwordResetRouter from './passwordReset.router.mjs'
import recipeRouter from './recipe.router.mjs'
import categoryRouter from './category.router.mjs'
import subCategoryRouter from './subCategory.router.mjs'
import tagRouter from './tag.router.mjs'
import ingredientRouter from './ingredient.router.mjs'
import chefRouter from './chef.router.mjs'
import { response } from '../utils/functions.mjs'
import { Code } from '../utils/consts.utils.mjs'

const router = express.Router()

router.use(cors())
router.use(new Controller().log)

router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/password', passwordResetRouter)
router.use('/recipes', recipeRouter)
router.use('/categories', categoryRouter)
router.use('/sub-categories', subCategoryRouter)
router.use('/tag', tagRouter)
router.use('/ingredient', ingredientRouter)
router.use('/chef', chefRouter)


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' })
})

router.all('/*', function (req, res, next) {
    response(res, { code: Code.ROUTE_NOT_FOUND })
})

router.use(errorMiddleware)

export default router