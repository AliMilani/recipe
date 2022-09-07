import mongoose from 'mongoose'
import { Code } from '../../utils/consts.utils.mjs'
import { response } from '../../utils/functions.mjs'
import _ from 'lodash'

export default function (err, req, res, next) {
    let ErrorCode = err.httpResponseCode ? err.httpResponseCode : Code.SERVER_ERROR
    if (err instanceof mongoose.Error.ValidationError) ErrorCode = Code.DATABASE_ERROR
    console.error(`${err.message} \n\n ${err.stack || ''}`, err)
    response(res, {
        code: ErrorCode,
        info: { ..._.pick(err, ['message', 'stack']), err }
    })
    process.exit(1)
}
