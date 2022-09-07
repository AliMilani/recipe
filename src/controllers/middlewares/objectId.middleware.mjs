import mongoose from 'mongoose'
import { Code } from '../../utils/consts.utils.mjs'
import { response } from '../../utils/functions.mjs'

export default function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return response(res, { code: Code.INVALID_ID, info: `'${req.params.id}' is not a valid ObjectId` })
    }

    next()
}
