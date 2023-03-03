import Controller from '../controller.mjs'
import tokenService from '../../services/token.service.mjs'
import userService from '../../services/user.service.mjs'
import { Code, UserType } from '../../utils/consts.utils.mjs'
import { verifyAccessToken, generateTokenHash } from '../../utils/token.utils.mjs'
import _ from 'lodash'
import * as token from '../../utils/token.utils.mjs'

const {
    ACCESS_TOKEN_TIME_EXTENSION_IS_ENABLED,
    ACCESS_TOKEN_EXTENSION_TIME_PERCENTAGE,
    ACCESS_TOKEN_TOTAL_ALLOWED_TIME_EXTENSIONS,
    ACCESS_TOKEN_STRICT_IP_CHECKING,
    IGNORE_AUTHENTICATION,
    IGNORE_AUTHORIZATION
} = process.env

class Auth extends Controller {
    constructor() {
        super()
        this.self = this
    }

    isAuth = async (req, res, next) => {
        if (IGNORE_AUTHENTICATION === 'true') return next()

        const receivedAccessToken = req.headers['x-access-token']
        // console.debug(receivedAccessToken)
        if (!receivedAccessToken) {
            return this.self.response(res, { code: Code.ACCESS_TOKEN_NOT_SET })
        }
        let decodedUser
        try {
            decodedUser = await verifyAccessToken(receivedAccessToken)
        } catch (err) {
            //access token is invalid or expired

            if (err.name === 'TokenExpiredError') {
                return this.self.response(res, { code: Code.ACCESS_TOKEN_EXPIRED, info: { err } })
            }
            if (err.name === 'JsonWebTokenError' && err.message === 'invalid token') {
                return this.self.response(res, { code: Code.ACCESS_TOKEN_INVALID, info: { err } })
            }
            return this.self.response(res, { code: Code.ACCESS_TOKEN_INVALID, info: { err } })
        }
        if (!decodedUser) {
            throw new Error('Could not decode user')
        }

        // access token time extension
        if (
            ACCESS_TOKEN_TIME_EXTENSION_IS_ENABLED === 'true' &&
            ACCESS_TOKEN_TOTAL_ALLOWED_TIME_EXTENSIONS !== '0'
        ) {
            const startAt = new Date(decodedUser.iat * 1000)
            const endAt = new Date(decodedUser.exp * 1000)
            const now = new Date()
            const timePassedInPercentage = Math.round((100 * (now - startAt)) / (endAt - startAt)) // percentage of time passed
            // console.log(`aToken timePassedInPercentage: ${timePassedInPercentage}%`)
            if (timePassedInPercentage > parseInt(ACCESS_TOKEN_EXTENSION_TIME_PERCENTAGE)) {
                // check if the user has already extended the time of the access token
                const targetToken = await tokenService.findByAccessToken(
                    generateTokenHash(receivedAccessToken),
                    {
                        includePreviousToken: true,
                        onlyActiveTokens: true
                    }
                )
                if (targetToken === null) {
                    return this.self.response(res, {
                        code: Code.ACCESS_TOKEN_EXPIRED,
                        info: 'access token does not exist in the database'
                    })
                }
                // isActive should be true
                if (targetToken.isActive === false) {
                    return this.self.response(res, {
                        code: Code.ACCESS_TOKEN_EXPIRED,
                        info: 'access token is not active ( may be user logged out )'
                    })
                }
                // access token last ip check
                if (ACCESS_TOKEN_STRICT_IP_CHECKING === 'true') {
                    if (targetToken.aTokenLastIP !== req.ip) {
                        return this.self.response(res, {
                            code: Code.ACCESS_TOKEN_INVALID,
                            info: 'access token last ip check failed'
                        })
                    }
                }
                // if it uses the previous access token, the time extension process should be ignored
                if (decodedUser.tokenCreatedAt === targetToken.aPreviousTokenCreatedAt) {
                    req.user = decodedUser
                    return next()
                }
                // access token create time does not equal to provided token
                if (decodedUser.tokenCreatedAt !== targetToken.aTokenCreatedAt) {
                    return this.self.response(res, {
                        code: Code.ACCESS_TOKEN_EXPIRED,
                        info: 'access token create time does not equal to provided token (create time)'
                    })
                }
                const totalAllowedTimeExtension = parseInt(
                    ACCESS_TOKEN_TOTAL_ALLOWED_TIME_EXTENSIONS
                )
                // check the total allowed time extensions
                if (targetToken && targetToken.aTotalTimeExtensions < totalAllowedTimeExtension) {
                    const targetUser = await userService.findById(targetToken.userId)
                    if (!targetUser) {
                        return this.self.response(res, {
                            code: Code.UNAUTHORIZED,
                            info: 'user does not exist'
                        })
                    }
                    // extension of access token time
                    const accessToken = token.createAccessToken(targetUser.toObject())
                    const newTokenDecodedUser = await token.verifyAccessToken(accessToken)
                    const { tokenCreatedAt } = newTokenDecodedUser
                    const updatedToken = await tokenService.updateById(targetToken._id, {
                        aTotalTimeExtensions: targetToken.aTotalTimeExtensions + 1,
                        aPreviousTokenHash: targetToken.aTokenHash,
                        aPreviousTokenCreatedAt: targetToken.aTokenCreatedAt,
                        aTokenCreatedAt: tokenCreatedAt,
                        aTokenHash: generateTokenHash(accessToken)
                    })
                    if (updatedToken === null) {
                        return this.self.response(res, {
                            code: Code.UNAUTHORIZED,
                            info: 'token does not exist in the database'
                        })
                    }
                    res.set('x-set-access-token', accessToken)
                    req.user = newTokenDecodedUser
                    return next()
                } else if (
                    targetToken &&
                    targetToken.aTotalTimeExtensions >= totalAllowedTimeExtension
                ) {
                    // user has reached the maximum number of time extension
                    return this.self.response(res, {
                        code: Code.ACCESS_TOKEN_EXPIRED,
                        info: 'Maximum number of time extension reached'
                    })
                } else {
                    throw new Error('Could not update access token')
                }
            }
        }

        req.user = decodedUser
        next()
    }

    isUser = async (req, res, next) => {
        if (IGNORE_AUTHORIZATION === 'true' && process.env.NODE_ENV === 'dev') return next()
        const user = req.user
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
        if (IGNORE_AUTHORIZATION === 'true' && process.env.NODE_ENV === 'dev') return next()

        const user = req.user
        if (!user) {
            return this.self.response(res, {
                info: { user, message: 'req.user is null' },
                code: Code.UNAUTHORIZED
            })
        }
        if (user.role !== UserType.ADMIN) {
            return this.self.response(res, {
                info: { user, UT: UserType.ADMIN },
                code: Code.USER_NOT_ADMIN
            })
        }
        next()
    }
}

export default new Auth()
