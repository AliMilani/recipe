import { Code } from './consts.utils.mjs'
import httpContext from 'express-http-context'


export const response = (res, data = {}, info = {}) => {
    let code = httpContext.get('status')

    let response = { code: code ? code.num : Code.OK.num, }
    if (process.env.NODE_ENV === 'development') {
        response.message = code ? code.mes : Code.OK.mes
        response.devMessage = code ? code.devMes : Code.OK.devMes
        response.info = info
    }
    response.data = data
    return res
        .status(code && code.status ? code.status : Code.OK.status)
        .json(response)
}

export const setCodeResponse = (code) => {
    let previousCode = httpContext.get('status')
    if (!previousCode || code.num === 500) httpContext.set('status', code)
}