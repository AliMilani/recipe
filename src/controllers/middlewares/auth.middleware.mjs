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
            setCodeResponse(Code.AUTH_IS_NOT_SET)
            return this.self.response(res, {}, {})
        }
        let user
        try {
            user = await verifyToken(token)
        } catch (err) {
            setCodeResponse(Code.TOKEN_INVALID)
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
        if (user.type !== UserType.USER) {
            setCodeResponse(Code.ACCESS_DENIED)
            return this.self.response(res, {}, {})
        }
        next()
    }

    isAdmin = async (req, res, next) => {
        let user = req.user
        if (!user) {
            setCodeResponse(Code.USER_NOT_FOUND)
            return this.self.response(res, {}, {})
        }
        if (user.type !== UserType.ADMIN) {
            setCodeResponse(Code.USER_NOT_ADMIN)
            return this.self.response(res, {}, {})
        }
        next()
    }
}

export default new Auth()
