import _ from 'lodash'
import { response } from '../../utils/functions.mjs'
import { Code } from '../../utils/consts.utils.mjs'
export default function apiValidate(validateFunction) {
    return async (req, res, next) => {
        if (!typeof validateFunction === 'function')
            throw new Error('validateFunction must be a function')
        const validationResults = await validateFunction(req.body)
        if (validationResults !== true) {
            const errors = validationResults.map((error) =>
                _.pick(error, ['field', 'type', 'message'])
            )
            return response(res, {
                errors,
                info: { validationResults },
                code: Code.INPUT_DATA_INVALID
            })
        }
        next()
    }
}
