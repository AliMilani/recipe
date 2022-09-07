import Validator from 'fastest-validator'
import { types, globalMessages } from './consts.validator.mjs'

const v = new Validator({
    useNewCustomCheckerFunction: true,
    messages: globalMessages
})

const passwordResetSchema = {
    password: types.password,
    password_confirmation: {
        type: 'equal',
        field: 'password',
        messages: {
            equalField: 'کلمه های عبور یکسان نمی باشند'
        },
        label: 'تکرار رمز عبور'
    },
    token: types.passwordResetToken,
    $$async: true
}

const passwordResetRequestSchema = {
    email: types.email,
    $$async: true,
    $$strict: true
}

const verifyPasswordResetSchema = {
    token: types.passwordResetToken
}

export const validatePasswordResetRequest = v.compile(passwordResetRequestSchema)
export const validatePasswordReset = v.compile(passwordResetSchema)
export const validateVerifyPasswordReset = v.compile(verifyPasswordResetSchema)
