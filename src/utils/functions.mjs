import { Code } from './consts.utils.mjs'
// import httpContext from 'express-http-context'
import _ from 'lodash'

export const response = (res, { data, info, errors, code } = props) => {
    let responseCode = code || Code.OK
    let response = { data, errors, msgCode: responseCode?.msgCode }
    if (process.env.NODE_ENV === 'dev')
        _.assign(response, { message: responseCode?.mes, devMessage: responseCode?.devMes, info })
    res.msgCode = code?.msgCode // to be used in requestLogger.utils.mjs
    return res
        .status(responseCode && responseCode.status ? responseCode.status : Code.OK.status)
        .json(response)
}
