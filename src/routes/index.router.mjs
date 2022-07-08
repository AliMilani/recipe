import express, { application } from 'express'
import cors from 'cors'
import Controller from '../controllers/controller.mjs'

const router = express.Router()

router.use(cors())
router.use(new Controller().log)

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' })
})

router.get('/*', function (req, res, next) {
    res.send('404')
})

export default router