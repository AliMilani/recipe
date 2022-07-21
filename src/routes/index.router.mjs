import express, { application } from 'express'
import cors from 'cors'
import winston from 'winston'
import errorMiddleware from '../controllers/middlewares/error.middleware.mjs'
import Controller from '../controllers/controller.mjs'
import authRouter from './auth.router.mjs'
import userRouter from './user.router.mjs'
import { response, setCodeResponse } from '../utils/functions.mjs'
import { Code } from '../utils/consts.utils.mjs'

const router = express.Router()

router.use(cors())
router.use(new Controller().log)

router.use('/auth', authRouter)
router.use('/users', userRouter)

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' })
})

router.get('/*', function (req, res, next) {
    res.send('404')
})

router.use(errorMiddleware)

export default router