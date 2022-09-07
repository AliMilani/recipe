import { Code } from './consts.utils.mjs'
import httpContext from 'express-http-context'

export const response = (res, { data, info, errors, code } = props) => {
    let responseCode = code ? code : httpContext.get('status')
    let response = { code: responseCode ? responseCode.num : Code.OK.num }
    if (process.env.NODE_ENV === 'dev') {
        response.message = responseCode ? responseCode.mes : Code.OK.mes
        response.devMessage = responseCode ? responseCode.devMes : Code.OK.devMes
        response.info = info
    }
    response.data = data
    response.errors = errors
    response.msgCode = code?.msgCode
    return res
        .status(responseCode && responseCode.status ? responseCode.status : Code.OK.status)
        .json(response)
}

export const setCodeResponse = (code) => {
    let previousCode = httpContext.get('status')
    if (!previousCode) httpContext.set('status', code)
}
