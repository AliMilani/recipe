import { RecaptchaV2 } from 'express-recaptcha'
import { Code } from '../../utils/consts.utils.mjs'
import { response } from '../../utils/functions.mjs'

export default async (req, res, next) => {
    if (process.env.RECAPTCHA_IS_ENABLED === 'false') return next()
    const recaptcha = new RecaptchaV2(
        process.env.RECAPTCHA_SITE_KEY,
        process.env.RECAPTCHA_SECRET_KEY,
        {
            callback: 'cb'
        }
    )
    recaptcha.verify(req, (err, data) =>
        err
            ? response(res, {
                code: Code.RECAPTCHA_VERIFICATION_FAILED,
                info: { err }
            })
            : next()
    )
}
