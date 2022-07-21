import mongoose from 'mongoose'
import { Code } from '../../utils/consts.utils.mjs'
import { response, setCodeResponse } from '../../utils/functions.mjs'

export default function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        setCodeResponse({ ...Code.INPUT_DATA_INVALID, devMes: 'Invalid user id' })
        return response(res, {}, {})
    }

    next()
}
