import _ from 'lodash'
import Controller from './controller.mjs'
import userService from '../services/user.service.mjs'
import tokenService from '../services/token.service.mjs'
import { Code } from '../utils/consts.utils.mjs'
import { passwordVerify } from '../utils/encrypt.utils.mjs'
import * as token from '../utils/token.utils.mjs'
import { calculateCustomDate } from '../utils/date.utils.mjs'

const {
    TOTAL_ACTIVE_SESSION_PER_USER_RESTRICTION,
    REFRESH_TOKEN_ROTATION_IS_ENABLED,
    REFRESH_TOKEN_EXPIRATION_TIME,
    // REFRESH_TOKEN_LIFETIME,
    REFRESH_TOKEN_TOTAL_ALLOWED_ROTATIONS
} = process.env

class Auth extends Controller {
    constructor() {
        super()
        this.self = this
    }

    signUp = async (req, res) => {
        const user = req.body

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
                return this.self.response(res, {
                    code: Code.EMAIL_EXIST,
                    info: { error }
                })
            }
            throw error
        }
        const cleanedUserObj = {
            ..._.pick(createdUser, ['email', 'role', 'createdAt', 'updatedAt']),
            id: createdUser._id
        }

        // create token
        const accessToken = token.createAccessToken(createdUser)
        const refreshToken = token.createRefreshToken()
        const rTokenHash = token.generateTokenHash(refreshToken)
        const aTokenHash = token.generateTokenHash(accessToken)
        const { tokenCreatedAt } = await token.verifyAccessToken(accessToken)
        const tokenObj = {
            rTokenHash,
            aTokenHash,
            userId: createdUser._id,
            loginIP: req.ip,
            aTokenLastIP: req.ip,
            aTokenCreatedAt: tokenCreatedAt
        }
        let createdToken = await tokenService.create(tokenObj)
        if (!createdToken) {
            // remove user
            await userService.delete(createdUser._id)
            throw new Error('Failed to create token')
        }

        //send response
        res.header('x-access-token', accessToken)
        res.header('x-refresh-token', refreshToken)

        return this.self.response(res, {
            data: cleanedUserObj,
            code: Code.CREATED,
            info: { createdToken, accessToken, refreshToken }
        })
    }

    signIn = async (req, res) => {
        const user = req.body

        // login
        let { email, password } = req.body
        const loggedInUser = await userService.findByEmail(_.toLower(email))

        if (!loggedInUser) {
            return this.self.response(res, {
                code: {
                    ...Code.AUTHENTICATION_FAILED,
                    devMes: 'کاربری با این ایمیل ثبت نام نکرده است'
                },
                info: { user, userObj: loggedInUser }
            })
        }
        try {
            await passwordVerify(password, loggedInUser.password)
        } catch (error) {
            return this.self.response(res, {
                code: { ...Code.AUTHENTICATION_FAILED, devMes: 'رمز عبور صحیح نمی‌باشد' },
                info: { user, userObj: loggedInUser, error }
            })
        }
        const cleanedUserObj = {
            ..._.pick(loggedInUser, ['email', 'role', 'createdAt', 'updatedAt']),
            id: loggedInUser._id
        }

        // create token
        const activeSession = await tokenService.findUserActiveSessions(loggedInUser._id)
        const totalActiveSessionPerUser = parseInt(TOTAL_ACTIVE_SESSION_PER_USER_RESTRICTION)
        if (
            totalActiveSessionPerUser !== 0 &&
            activeSession &&
            activeSession.length >= totalActiveSessionPerUser
        ) {
            //sort sessions by refresh expire date
            const sortedSessions = activeSession.sort((a, b) => {
                return new Date(a.rValidUntil).getTime() - new Date(b.rValidUntil).getTime()
            })
            // console.log(sortedSessions.length);
            //deactivate old sessions
            for (let i = 0; i <= sortedSessions.length - totalActiveSessionPerUser; i++) {
                await tokenService.updateById(sortedSessions[i]._id, {
                    isActive: false
                })
            }
        }
        const accessToken = token.createAccessToken(loggedInUser)
        const refreshToken = token.createRefreshToken()
        const rTokenHash = token.generateTokenHash(refreshToken)
        const aTokenHash = token.generateTokenHash(accessToken)
        const { tokenCreatedAt } = await token.verifyAccessToken(accessToken)
        const tokenObj = {
            rTokenHash,
            aTokenHash,
            userId: loggedInUser._id,
            loginIP: req.ip,
            aTokenLastIP: req.ip,
            aTokenCreatedAt: tokenCreatedAt
        }
        let createdToken = await tokenService.create(tokenObj)
        if (!createdToken) {
            // remove user
            await userService.delete(createdUser._id)
            throw new Error('Failed to create token')
        }

        //send response
        res.header('x-access-token', accessToken)
        res.header('x-refresh-token', refreshToken)

        return this.self.response(res, {
            data: cleanedUserObj,
            code: Code.CREATED,
            info: {
                user,
                userObj: loggedInUser,
                cleanedUserObj,
                accessToken,
                refreshToken
            }
        })
    }

    logOut = async (req, res) => {
        const receivedAccessToken = req.headers['x-access-token']
        const receivedRefreshToken = req.headers['x-refresh-token']

        if (receivedAccessToken) {
            let decodedUser
            let tokenIsValid = false
            try {
                decodedUser = await token.verifyAccessToken(receivedAccessToken)
                tokenIsValid = true
            } catch (err) {
                // console.info(err)
            }
            if (decodedUser && tokenIsValid) {
                const targetToken = await tokenService.findByAccessToken(
                    token.generateTokenHash(receivedAccessToken)
                )
                if (targetToken) {
                    const deactivatedToken = await tokenService.updateById(targetToken._id, {
                        isActive: false
                    })
                    if (deactivatedToken) {
                        return this.self.response(res, {
                            code: Code.OK,
                            info: 'logout success (by access token)'
                        })
                    }
                }
            }
        }
        if (receivedRefreshToken) {
            const targetToken = await tokenService.findByRefreshToken(
                token.generateTokenHash(receivedRefreshToken)
            )
            if (targetToken) {
                const deactivatedToken = await tokenService.updateById(targetToken._id, {
                    isActive: false
                })
                if (deactivatedToken) {
                    return this.self.response(res, {
                        code: Code.OK,
                        info: 'logout success (by refresh token)'
                    })
                }
                throw new Error('Failed to deactivate token')
            } else {
                // token not found
                return this.self.response(res, {
                    code: Code.TOKEN_DOES_NOT_EXIST,
                    info: 'refresh token not found in database'
                })
            }
        } else {
            return this.self.response(res, { code: Code.REFRESH_TOKEN_NOT_SET })
        }
    }

    refreshToken = async (req, res) => {
        const { refreshToken } = req.body

        // get token
        const targetToken = await tokenService.findByRefreshToken(
            token.generateTokenHash(refreshToken)
        )
        // check if token exist
        if (!targetToken) {
            return this.self.response(res, {
                code: Code.TOKEN_DOES_NOT_EXIST,
                info: {
                    refreshToken,
                    targetToken,
                    message: 'maybe the token was rotated or user logged out'
                }
            })
        }

        // get user
        const targetUser = await userService.findById(targetToken.userId)
        // check if user exist
        if (!targetUser) {
            return this.self.response(res, {
                code: Code.USER_NOT_FOUND,
                info: { refreshToken, targetToken, user: targetUser }
            })
        }

        //check token life time
        if (new Date().getTime() > new Date(targetToken.rEndLife).getTime()) {
            return this.self.response(res, {
                code: Code.REFRESH_TOKEN_EXPIRED,
                info: { refreshToken, targetToken, message: 'refresh token expired by life time' }
            })
        }

        //check if token is expired
        if (new Date(targetToken.rValidUntil).getTime() < new Date().getTime()) {
            return this.self.response(res, {
                code: Code.REFRESH_TOKEN_EXPIRED,
                info: {
                    refreshToken,
                    targetToken,
                    message: 'refresh token expired by expiration time'
                }
            })
        }

        // generate new tokens
        let newRefreshToken
        let rTokenHash
        let rTotalRotations = targetToken.rTotalRotations
        //check if refresh token rotatable
        if (REFRESH_TOKEN_ROTATION_IS_ENABLED === 'true') {
            //check total rotate limit
            const totalRotateLimit = parseInt(REFRESH_TOKEN_TOTAL_ALLOWED_ROTATIONS)
            // totalRotateLimit === 0 means no limit
            if (totalRotateLimit !== 0 && targetToken.rTotalRotations >= totalRotateLimit) {
                return this.self.response(res, {
                    code: Code.REFRESH_TOKEN_EXPIRED,
                    info: {
                        refreshToken,
                        targetToken,
                        totalRotateLimit,
                        rRotateCount: targetToken.rRotateCount,
                        message: 'refresh token rotation limit reached'
                    }
                })
            } else {
                // use old refresh tokens because rotate limit is not reached
                newRefreshToken = token.createRefreshToken()
                rTokenHash = token.generateTokenHash(newRefreshToken)
                rTotalRotations++
                // console.log(rTokenHash)
            }
        } else {
            // refresh token is not rotatable
            newRefreshToken = refreshToken // use old refresh token sent by client
            rTokenHash = targetToken.rTokenHash // use old refresh token hash
        }
        if (!newRefreshToken || !rTokenHash) {
            throw new Error('Failed to generate new refresh token')
        }
        const newAccessToken = token.createAccessToken(targetUser)
        const aTokenHash = token.generateTokenHash(newAccessToken)
        const { tokenCreatedAt } = await token.verifyAccessToken(newAccessToken)
        const tokenObj = {
            rTokenHash,
            aTokenHash,
            rTotalRotations,
            aTokenLastIP: req.ip,
            userId: targetUser._id,
            aTokenCreatedAt: tokenCreatedAt,
            rValidUntil: calculateCustomDate(REFRESH_TOKEN_EXPIRATION_TIME)
        }
        let updatedToken = await tokenService.updateById(targetToken._id, tokenObj)
        if (!updatedToken) {
            throw new Error('Failed to update token')
        }

        //send response
        // res.header('x-access-token', accessToken)
        // res.header('x-refresh-token', refreshToken)

        return this.self.response(res, {
            data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
            code: Code.CREATED,
            info: { updatedToken }
        })
    }
}

export default new Auth()
