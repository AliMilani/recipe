import { cleanEnv, makeValidator, str, num, bool, port, url, defaultReporter } from 'envalid'
import { calculateCustomDate } from './date.utils.mjs'
import _ from 'lodash'

const _minLength = (options, min) => {
    return makeValidator((value) => {
        if (value.length < min) throw new Error(`Value must be at least ${min} characters long`)
        return value
    })(options, min)
}

const _match = (options, regex) => {
    return makeValidator((value) => {
        if (!regex.test(value)) throw new Error(`Value must match ${regex}`)
        return value
    })(options, regex)
}

const _optional = makeValidator((value) => {
    if (value === undefined) return undefined
    return value
})

const _range = (options, min, max) => {
    return makeValidator((value) => {
        if (value < min || value > max) throw new Error(`Value must be between ${min} and ${max}`)
        return value
    })(options, min, max)
}

const _customDate = makeValidator((customDate) => {
    calculateCustomDate(customDate)
    return customDate
})

/* prettier-ignore */

function validateEnv() {
    const EMAIL_ADDRESS_REGEX = /^\S+@\S+\.\S+$/

    const envs = cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['dev', 'production'],
            desc: 'The environment in which the app is running  (e.g. dev, production)',
            example: 'dev',
        }),
        MONGODB_URI: url({ desc: 'The url to the mongodb instance', docs: 'https://docs.mongodb.com/manual/reference/connection-string/' }),
        PORT: port({ desc: 'The port the app will run on', example: '3000' }),
        TOKEN_SECRET: _minLength({ desc: 'The secret used to sign tokens' }, 16),
        SALT_ROUNDS: num({ example: 10, desc: 'Salt rounds for bcrypt' }),
        TOTAL_ACTIVE_SESSION_PER_USER_RESTRICTION: num({ example: '0', desc: 'Total active session per user. (0 = unlimited)' }), // 0 = unlimited
        REFRESH_TOKEN_EXPIRATION_TIME: _customDate({ example: '7d', desc: 'Refresh token expiration time. (e.g. 1d, 1h, 1m, 1s)' }),
        REFRESH_TOKEN_LIFETIME: _customDate({ example: '30d', desc: 'Refresh token lifetime. (e.g. 1d, 1h, 1m, 1s)' }),
        REFRESH_TOKEN_TOTAL_ALLOWED_ROTATIONS: num({ example: '0', desc: 'Total rotations for refresh token. (0 = unlimited)' }), // 0 = unlimited
        REFRESH_TOKEN_ROTATION_IS_ENABLED: bool({ example: true, desc: 'Rotate refresh token' }),
        ACCESS_TOKEN_LIFETIME: _customDate({ example: '5m', desc: 'Access token lifetime. (e.g. 1d, 1h, 1m, 1s)' }), // 5m = 5 minutes
        ACCESS_TOKEN_TOTAL_ALLOWED_TIME_EXTENSIONS: num({ example: '8', desc: 'Total time extensions for access token. (0 = unlimited)' }), // 0 = unlimited
        ACCESS_TOKEN_TIME_EXTENSION_IS_ENABLED: bool({ example: true, desc: 'Enable time extensions for access token' }),
        ACCESS_TOKEN_EXTENSION_TIME_PERCENTAGE: _range({ example: '80', desc: 'Access token extension time percentage. (0-100) 0 = disabled' }, 0, 100),
        ACCESS_TOKEN_STRICT_IP_CHECKING: bool({ example: false, desc: 'Strict IP checking for access token.' }),
        PASSWORD_RESET_EXPIRATION_TIME: _customDate({ example: '15m', desc: 'Password reset expiration time. (e.g. 1d, 1h, 1m, 1s)' }),
        MAIL_SENDER: _match({ desc: 'The email address used to send emails', example: 'user@example.com' }, EMAIL_ADDRESS_REGEX),
        MAIL_USER: _match({ desc: 'The email address used to connect to the mail server', example: 'user@example.com' }, EMAIL_ADDRESS_REGEX),
        MAIL_PASSWORD: str({ desc: 'The password used to connect to the mail server' }),
        MAIL_PORT: port({ desc: 'The port used to connect to the mail server', example: '587' }),
        MAIL_HOST: str({ desc: 'The host used to connect to the mail server', example: 'smtp.example.com' }),

    })

    // Preliminary examination of logical errors
    if (calculateCustomDate(envs.REFRESH_TOKEN_EXPIRATION_TIME) > calculateCustomDate(envs.REFRESH_TOKEN_LIFETIME))
        throw new Error('[ENVS ERROR] REFRESH_TOKEN_EXPIRATION_TIME must be greater than REFRESH_TOKEN_LIFETIME')
    if (calculateCustomDate(envs.ACCESS_TOKEN_LIFETIME) > calculateCustomDate(envs.REFRESH_TOKEN_EXPIRATION_TIME))
        throw new Error('[ENVS ERROR] ACCESS_TOKEN_LIFETIME must be less than REFRESH_TOKEN_EXPIRATION_TIME')
    if (calculateCustomDate(envs.ACCESS_TOKEN_LIFETIME) > calculateCustomDate(envs.REFRESH_TOKEN_LIFETIME))
        throw new Error('[ENVS ERROR] ACCESS_TOKEN_LIFETIME must be less than REFRESH_TOKEN_LIFETIME')

    // return envs
}

export default validateEnv
