import _ from 'lodash'
import Controller from './controller.mjs'
import userService from '../services/user.service.mjs'
import passwordResetService from '../services/passwordReset.service.mjs'
import tokenService from '../services/token.service.mjs'
import { Code } from '../utils/consts.utils.mjs'
import { generatePasswordResetToken, generateTokenHash } from '../utils/token.utils.mjs'
import emailUtils from '../utils/email.utils.mjs'
import { calculateCustomDate } from '../utils/date.utils.mjs'
import { passwordHash, passwordVerify } from '../utils/encrypt.utils.mjs'

const { PASSWORD_RESET_EXPIRATION_TIME } = process.env

class ResetPassword extends Controller {
    constructor() {
        super()
        this.self = this
    }

    #last10SuccessfulCreateResponseTime = []

    #checkTokenValidity = async (targetPasswordReset) => {
        if (targetPasswordReset === null) {
            return false
        }
        if (targetPasswordReset.invalidated === true) {
            return false
        }
        const PASSWORD_RESET_TOKEN_VALIDITY_TIME_IN_MS =
            calculateCustomDate(PASSWORD_RESET_EXPIRATION_TIME).getTime() - Date.now()
        if (
            targetPasswordReset.createdAt.getTime() + PASSWORD_RESET_TOKEN_VALIDITY_TIME_IN_MS <
            Date.now()
        ) {
            return false
        }
        return true
    }

    request = async (req, res) => {
        const requestStartTime = new Date().getTime()
        let { email } = req.body
        email = _.toLower(email)

        const targetUser = await userService.findByEmail(email)
        if (targetUser === null) {
            try {
                await emailUtils.send({
                    to: email,
                    subject: 'بازنشانی رمز عبور - {{نام سایت}}',
                    templateFile: 'emails/password-reset-email-not-found',
                })
                // console.info('email (user not found) sent')

                // The reason for this is that we want to send the response as soon as possible
                const avrageResponseTime =
                    _.mean(this.#last10SuccessfulCreateResponseTime.sort().slice(0, 7)) || 0 // take the last 7 (of 10) fastest responses and take the average

                const passedTime = new Date().getTime() - requestStartTime
                const delayTime =
                    passedTime > avrageResponseTime ? 0 : avrageResponseTime - passedTime
                // UX recommendation: response time should be less than 10 seconds (but not secure)
                await new Promise((resolve) =>
                    setTimeout(resolve, delayTime > 10000 ? 10000 : delayTime)
                )
                return this.self.response(res, {
                    code: Code.OK,
                    info: {
                        message: 'کاربری با این ایمیل پیدا نشد - ایمیل با موفقیت ارسال شد',
                        lastTenCreateResponseTime: this.#last10SuccessfulCreateResponseTime,
                        avrageResponseTime: avrageResponseTime
                    }
                })
            } catch (err) {
                throw new Error(`Error sending email : ${err}`)
            }
        }

        //invalidate all previous password reset tokens for security reasons
        await passwordResetService.invalidateAllByUserId(targetUser.id)

        // generate a new password reset token
        const passwordResetToken = generatePasswordResetToken()
        const createdPasswordReset = await passwordResetService.create({
            userId: targetUser._id,
            tokenHash: generateTokenHash(passwordResetToken)
        })
        if (createdPasswordReset === null) {
            throw new Error('Error creating password reset')
        }
        // send password reset link to user email
        try {
            await emailUtils.send({
                to: email,
                subject: 'بازنشانی رمز عبور - {{نام سایت}}',
                templateFile: 'emails/password-reset-confirm',
                data: {
                    token: passwordResetToken
                }
            })
            // console.info('email (confirm) sent')
        } catch (err) {
            await passwordResetService.deleteByTokenHash(createdPasswordReset.tokenHash)
            throw new Error(`Error sending email : ${err}`)
        }

        /* To prevent attacks from detecting "user enumeration" with the response time,
        if the user is not found, the response should be sent with the same response time */
        this.#last10SuccessfulCreateResponseTime = [
            ...this.#last10SuccessfulCreateResponseTime,
            new Date().getTime() - requestStartTime
        ].slice(-10) // keep the last 10 successful responses
        this.self.response(res, {
            code: Code.OK,
            info: {
                message: 'ایمیل بازیابی رمز عبور با موفقیت ارسال شد',
                lastTenCreateResponseTime: this.#last10SuccessfulCreateResponseTime,
                // totalRequestsAtLast10Minutes,
                passwordResetToken
            }
        })
    }

    verifyToken = async (req, res) => {
        const { token } = req.body
        const targetPasswordReset = await passwordResetService.findByTokenHash(
            generateTokenHash(token)
        )
        if (!(await this.#checkTokenValidity(targetPasswordReset))) {
            return this.self.response(res, {
                code: Code.PASSWORD_RESET_TOKEN_EXPIRED,
                info: 'توکن بازیابی رمز عبور منقضی شده است'
            })
        }
        return this.self.response(res, {
            code: Code.OK,
            info: {
                message: 'توکن معتبر است',
                targetPasswordReset
            }
        })
    }

    reset = async (req, res) => {
        const { token, password, password_confirmation } = req.body

        const targetPasswordReset = await passwordResetService.findByTokenHash(
            generateTokenHash(token)
        )

        if (!(await this.#checkTokenValidity(targetPasswordReset))) {
            return this.self.response(res, {
                code: Code.PASSWORD_RESET_TOKEN_EXPIRED
            })
        }

        const targetUser = await userService.findById(targetPasswordReset.userId)

        if (targetUser === null) {
            throw new Error(`User not found with id ${targetPasswordReset.userId}`)
            // return this.self.response(res, {
            //     code: Code.USER_NOT_FOUND,
            //     info: {
            //         message: 'کاربر مورد نظر یافت نشد'
            //     }
            // })
        }

        // users shouldn't provide the old password as a new password
        try {
            if (await passwordVerify(password, targetUser.password)) {
                return this.self.response(res, {
                    code: Code.PASSWORD_ALREADY_USED
                })
            }
        } catch { }

        //update password
        await userService.update(targetUser._id, {
            password: await passwordHash(password)
        })

        //invalidate all previous password reset tokens for security reasons
        await passwordResetService.invalidateAllByUserId(targetUser._id)

        // invalidate all previous tokens for security reasons
        await tokenService.deactivateAllByUserId(targetUser._id)
        return this.self.response(res, {
            code: Code.OK,
            info: {
                message: 'رمز عبور با موفقیت تغییر کرد'
            }
        })
    }
}

export default new ResetPassword()
