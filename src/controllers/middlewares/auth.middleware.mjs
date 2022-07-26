import Controller from '../controller.mjs'
import tokenService from '../../services/token.service.mjs'
import userService from '../../services/user.service.mjs'
import { Code, UserType } from '../../utils/consts.utils.mjs'
import { verifyAccessToken, generateHash } from '../../utils/token.utils.mjs'
import _ from 'lodash'
import * as token from '../../utils/token.utils.mjs'

const {
    ACCESS_TOKEN_ROTATION_IS_ENABLED,
    ACCESS_TOKEN_ROTATE_TIME_PERCENTAGE,
    ACCESS_TOKEN_TOTAL_ALLOWED_ROTATIONS,
    ACCESS_TOKEN_STRICT_IP_CHECKING
} = process.env

class Auth extends Controller {
    constructor() {
        super()
        this.self = this
    }

    isAuth = async (req, res, next) => {
        const receivedAccessToken = req.headers['x-access-token']
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

        // access token rotation
        if (ACCESS_TOKEN_ROTATION_IS_ENABLED === 'true' && ACCESS_TOKEN_TOTAL_ALLOWED_ROTATIONS !== '0') {
            const startAt = new Date(decodedUser.iat * 1000)
            const endAt = new Date(decodedUser.exp * 1000)
            const now = new Date()
            const timePassedInPercentage = Math.round((100 * (now - startAt)) / (endAt - startAt)) // percentage of time passed
            // console.log(`aToken timePassedInPercentage: ${timePassedInPercentage}%`)
            if (timePassedInPercentage > parseInt(ACCESS_TOKEN_ROTATE_TIME_PERCENTAGE)) {
                // check if the user has already rotated the access token
                const targetToken = await tokenService.findByAccessToken(
                    generateHash(receivedAccessToken)
                )
                if (targetToken === null) {
                    return this.self.response(res, {
                        code: Code.ACCESS_TOKEN_EXPIRED,
                        info: 'access token does not exist ( may be rotated )'
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

                // access token rotated time does not equal to provided token
                if (decodedUser.tokenCreatedAt !== targetToken.aTokenCreatedAt) {
                    return this.self.response(res, {
                        code: Code.ACCESS_TOKEN_EXPIRED,
                        info: 'access token created time does not equal to provided token (rotated time)'
                    })
                }
                const totalAllowedRotations = parseInt(ACCESS_TOKEN_TOTAL_ALLOWED_ROTATIONS)
                // check total rotations allowed
                if (targetToken && targetToken.aTotalRotations < totalAllowedRotations) {
                    const targetUser = await userService.findById(targetToken.userId)
                    if (!targetUser) {
                        return this.self.response(res, {
                            code: Code.UNAUTHORIZED,
                            info: 'user does not exist'
                        })
                    }
                    // rotate access token
                    const accessToken = token.createAccessToken(targetUser.toObject())
                    const newTokenDecodedUser = await token.verifyAccessToken(accessToken)
                    const { tokenCreatedAt } = newTokenDecodedUser
                    const updatedToken = await tokenService.updateById(targetToken._id, {
                        aTotalRotations: targetToken.aTotalRotations + 1,
                        aTokenCreatedAt: tokenCreatedAt,
                        aTokenHash: generateHash(accessToken)
                    })
                    if (updatedToken === null) {
                        return this.self.response(res, {
                            code: Code.TOKEN_DOES_NOT_EXIST,
                            info: { updatedToken }
                        })
                    }
                    res.set('x-set-access-token', accessToken)
                    req.user = newTokenDecodedUser
                    return next()
                } else if (targetToken && targetToken.aTotalRotations >= totalAllowedRotations) {
                    // user has reached the maximum number of rotations
                    return this.self.response(res, {
                        code: Code.ACCESS_TOKEN_EXPIRED,
                        info: 'Maximum number of rotations reached'
                    })
                } else {
                    throw new Error('Could not rotate access token')
                }
            }
        }

        req.user = decodedUser
        next()
    }

    isUser = async (req, res, next) => {
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
