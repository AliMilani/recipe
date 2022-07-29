import { Code } from '../../utils/consts.utils.mjs'
import { response } from '../../utils/functions.mjs'
import _ from 'lodash'

export default function (err, req, res, next) {
    console.error(err.message, err)
    return response(res, {
        code: Code.SERVER_ERROR,
        info: { ..._.pick(err, ['message', 'stack']) }
    })
}
