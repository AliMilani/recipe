import _ from 'lodash'
import httpContext from 'express-http-context'
import Controller from './controller.mjs'
import userService from '../services/user.service.mjs'
import { Code, UserType } from '../utils/consts.utils.mjs'
import { setCodeResponse } from '../utils/functions.mjs'
import { validateUserByPass } from './validators/user.validator.mjs'
import { passwordVerify } from '../utils/encrypt.utils.mjs'
import * as token from '../utils/token.utils.mjs'

class Auth extends Controller {
    constructor() {
        super()
        this.self = this
    }

    signUp = async (req, res) => {
        const user = req.body

        // validate user
        const userValidation = await validateUserByPass(user)
        if (userValidation !== true) {
            const errors = userValidation.map((error) =>
                _.pick(error, ['field', 'type', 'message'])
            )
            setCodeResponse(Code.INPUT_DATA_INVALID)
            return this.self.response(res, {}, { errors, userValidation })
        }

        // SignUp user
        const userObj = _.pick(user, ['email', 'password'])
        /* 
        If we don't lowercase the email, user can create a new user with a duplicate email 
        https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#user-ids
        */
        userObj.email = _.toLower(userObj.email)
        let createdUser
        try {
            createdUser = await userService.create(userObj)
        } catch (error) {
            if (error.code === 11000 && error.keyPattern.email) {
                setCodeResponse(Code.EMAIL_EXIST)
                return this.self.response(res, {}, {})
            }
            throw error
        }
        const cleanedUserObj = {
            ..._.pick(createdUser, ['email', 'role', 'createdAt', 'updatedAt']),
            id: createdUser._id
        }

        // create token
        let accessToken = token.createToken(createdUser)

        //send response
        res.header('x-auth-token', accessToken)

        setCodeResponse(Code.CREATED)
        return this.self.response(res, cleanedUserObj, {
            user: user,
            createdUser: createdUser,
            cleanedUserObj: cleanedUserObj,
            accessToken: accessToken
        })
    }

    signIn = async (req, res) => {
        const user = req.body

        // validate user
        const userValidation = await validateUserByPass(user)
        if (userValidation !== true) {
            const errors = userValidation.map((error) =>
                _.pick(error, ['field', 'type', 'message'])
            )
            setCodeResponse(Code.INPUT_DATA_INVALID)
            return this.self.response(res, {}, { errors, userValidation })
        }

        // // login and create token
        let { email, password } = req.body
        let userObj = await userService.findByEmail(_.toLower(email))

        if (!userObj) {
            setCodeResponse({
                ...Code.AUTHENTICATION_FAILED,
                devMes: 'کاربری با این ایمیل ثبت نام نکرده است'
            })
            return this.self.response(res, {}, { user, userObj })
        }
        try {
            await passwordVerify(password, userObj.password)
        } catch (error) {
            setCodeResponse({ ...Code.AUTHENTICATION_FAILED, devMes: 'رمز عبور صحیح نمی‌باشد' })
            return this.self.response(res, {}, { user, userObj, error })
        }
        const cleanedUserObj = {
            ..._.pick(userObj, ['email', 'role', 'createdAt', 'updatedAt']),
            id: userObj._id
        }

        // create token
        let accessToken = token.createToken(userObj)

        //send response
        res.header('x-auth-token', accessToken)

        setCodeResponse(Code.CREATED)
        return this.self.response(res, cleanedUserObj, {
            user,
            userObj,
            cleanedUserObj,
            accessToken
        })
    }
}

export default new Auth()
