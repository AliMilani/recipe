import winston from 'winston'
import { Code } from '../../utils/consts.utils.mjs'
import { response, setCodeResponse } from '../../utils/functions.mjs'
import _ from 'lodash'

export default function (err, req, res, next) {
    winston.error(err.message, err)
    console.error(err.message, err)
    setCodeResponse(Code.SERVER_ERROR)
    return response(res, {}, { ..._.pick(err, ['message', 'stack']) })
}
