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
            return this.self.response(res, { code: Code.ACCESS_TOKEN_NOT_SET })
        }
        let user
        try {
            user = await verifyToken(token)
        } catch (err) {
            return this.self.response(res, { code: Code.ACCESS_TOKEN_INVALID })
        }
        if (!user) {
            return this.self.response(res, { code: Code.USER_NOT_FOUND })
        }
        req.user = user
        next()
    }

    isUser = async (req, res, next) => {
        let user = req.user
        if (!user) {
            return this.self.response(res, { code: Code.USER_NOT_FOUND })
        }
        if (user.role !== UserType.USER) {
            return this.self.response(res, {
                code: Code.USER_NOT_FOUND,
                info: 'User type is not a user'
            })
        }
        next()
    }

    isAdmin = async (req, res, next) => {
        let user = req.user
        if (!user) {
            return this.self.response(res, {
                info: { user },
                code: Code.UNAUTHORIZED
            })
        }
        if (user.role !== UserType.ADMIN) {
            return this.self.response(res, {
                info: { user },
                code: Code.USER_NOT_ADMIN
            })
        }
        next()
    }
}

export default new Auth()
