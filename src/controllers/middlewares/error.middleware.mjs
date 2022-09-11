import mongoose from 'mongoose'
import { Code } from '../../utils/consts.utils.mjs'
import { response } from '../../utils/functions.mjs'
import _ from 'lodash'
import server from '../../server.mjs'

export default function (err, req, res, next) {
    let ErrorCode = err.httpResponseCode ? err.httpResponseCode : Code.SERVER_ERROR
    if (err instanceof mongoose.Error.ValidationError) ErrorCode = Code.DATABASE_ERROR
    if (err instanceof Error) {
        console.error(`${err.message} \n\n ${err.stack || ''}`)
    } else if (err) {
        console.error(err)
    }
    res.err = err // to be used in request logger middleware
    response(res, {
        code: ErrorCode,
        info: { ..._.pick(err, ['message', 'stack']), err }
    })

    // Attempt a graceful shutdown
    server.close(1)
    setTimeout(() => process.exit(1), 1000).unref()
}
