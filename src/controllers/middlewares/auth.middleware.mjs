import Controller from '../controller.mjs'
import { Code, UserType } from '../../utils/consts.utils.mjs'
import { verifyToken } from '../../utils/token.utils.mjs'
import { setCodeResponse } from '../../utils/functions.mjs'

class Auth extends Controller {
    constructor() {
        super()
        this.self = this
    }

    isAuth = async (req, res, next) => {
        let token = req.headers['x-auth-token']
        if (!token) {
            setCodeResponse(Code.ACCESS_TOKEN_NOT_SET)
            return this.self.response(res, {}, {})
        }
        let user
        try {
            user = await verifyToken(token)
        } catch (err) {
            setCodeResponse(Code.ACCESS_TOKEN_INVALID)
            return this.self.response(res, {}, {})
        }
        if (!user) {
            setCodeResponse(Code.USER_NOT_FOUND)
            return this.self.response(res, {}, {})
        }
        req.user = user
        next()
    }

    isUser = async (req, res, next) => {
        let user = req.user
        if (!user) {
            setCodeResponse(Code.USER_NOT_FOUND)
            return this.self.response(res, {}, {})
        }
        if (user.role !== UserType.USER) {
            setCodeResponse({ ...Code.USER_NOT_FOUND, devMsg: 'User type is not a user' })
            return this.self.response(res, {}, {})
        }
        next()
    }

    isAdmin = async (req, res, next) => {
        let user = req.user
        if (!user) {
            setCodeResponse(Code.UNAUTHORIZED)
            return this.self.response(res, {}, { user })
        }
        if (user.role !== UserType.ADMIN) {
            setCodeResponse(Code.USER_NOT_ADMIN)
            return this.self.response(res, {}, { user })
        }
        next()
    }
}

export default new Auth()