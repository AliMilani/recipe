import Controller from './controller.mjs'
import { Code, UserType } from '../utils/consts.utils.mjs'
import { setCodeResponse } from '../utils/functions.mjs'
import httpContext from 'express-http-context'
import { validateUserByPass } from './validators/user.validator.mjs'
import userService from '../services/user.service.mjs'
import * as token from '../utils/token.utils.mjs'
import { passwordVerify } from '../utils/encrypt.utils.mjs'

class Auth extends Controller {
    constructor() {
        super()
        this.self = this
    }

    signUp = async (req, res) => {
        //validate user
        let userValidation = await validateUserByPass(req.body)
        if (userValidation !== true) {
            // console.log(userValidation)
            // userValidation.forEach((error) => {
            //     if (error.field === 'email') {
            //         if (error.type === 'required') {
            //             setCodeResponse({ mes: 'Email is required', status: 400 })
            //         }
            //         if (error.type === 'email') {
            //             setCodeResponse({ mes: 'Email is invalid', status: 400 })
            //         }
            //         if (error.type === 'emailMax' || error.type === 'emailMin') {
            //             setCodeResponse({ mes: 'Email should be between 6 and 254 characters', status: 400 })
            //         }
            //     }
            //     if (error.field === 'password') {
            //         if (error.type === 'required') {
            //             setCodeResponse({ mes: 'Password is required', status: 400 })
            //         }
            //         if (error.type === 'stringMin') {
            //             setCodeResponse({ mes: 'Password should be at least 8 characters', status: 400 })
            //         }
            //         if (error.type === 'stringMax') {
            //             setCodeResponse({ mes: 'Password should be at most 255 characters', status: 400 })
            //         }
            //     }
            // })
            setCodeResponse(Code.INPUT_DATA_INVALID)
            return this.self.response(res, {}, userValidation)
        }

        // create user
        let user
        try {
            user = await userService.create({
                ...req.body,
                role: UserType.USER
            })
        } catch (error) {
            if (error.code === 11000 && error.keyPattern.email) {
                setCodeResponse(Code.EMAIL_EXIST)
                return this.self.response(res, {}, {})
            }
            throw error
        }

        // create token
        let accessToken = token.createToken(user)

        //send response
        res.header('x-auth-token', accessToken)
        return this.self.response(res, {}, { userObj: user })
    }

    signIn = async (req, res) => {
        //validate user
        let userValidation = await validateUserByPass(req.body)
        if (userValidation !== true) {
            setCodeResponse(Code.INPUT_DATA_INVALID)
            return this.self.response(res, {}, userValidation)
        }

        // login and create token
        let { email, password } = req.body
        let user = await userService.findByEmail(email)

        if (!user) {
            setCodeResponse({ ...Code.AUTHENTICATION_FAILED, devMes: 'کاربری با این ایمیل ثبت نام نکرده است' })
            return this.self.response(res, {}, req.body)
        }
        try {
            await passwordVerify(password, user.password)
        } catch (error) {
            setCodeResponse({ ...Code.AUTHENTICATION_FAILED, devMes: 'رمز عبور صحیح نمی‌باشد' })
            return this.self.response(res, {}, req.body)
        }

        const accessToken = token.createToken(user)

        //send response
        res.header('x-auth-token', accessToken)
        return this.self.response(res, {}, {})
    }

    me = async (req, res) => {
        if (!req.user) {
            setCodeResponse(Code.AUTH_IS_NOT_SET)
            return this.self.response(res, {}, {})
        }
        console.log(req.user)
        const user = await userService.findById(req.user.id)
        const userObj = {
            id: user._id.toString(),
            role: user.role,
            email: user.email,
            createdAt: user.createdAt
        }
        return this.self.response(res, userObj, {})
    }
}

export default new Auth()
