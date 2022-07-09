import express, { application } from 'express'
import cors from 'cors'
import errorMiddleware from '../controllers/middlewares/error.middleware.mjs'
import Controller from '../controllers/controller.mjs'
// import userRouter from './user.router.mjs'

const router = express.Router()

router.use(cors())
router.use(new Controller().log)

// router.use('/users', userRouter)
router.use(errorMiddleware)

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' })
})

router.get('/*', function (req, res, next) {
    res.send('404')
})

export default router