import Validator from 'fastest-validator'
import { types, globalMessages } from './consts.validator.mjs'

const v = new Validator({
    useNewCustomCheckerFunction: true,
    messages: globalMessages
})

const refreshTokenSchema = {
    refreshToken: {
        type: 'string',
        length: 128,
        label: 'رفرش توکن'
    },
}

export const validateRefreshToken = v.compile(refreshTokenSchema)
