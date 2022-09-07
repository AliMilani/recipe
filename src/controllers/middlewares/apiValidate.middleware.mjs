import _ from 'lodash'
import { response } from '../../utils/functions.mjs'
import { Code } from '../../utils/consts.utils.mjs'
/**
 * - Validate request body
 * @param {Function} validateFunction fastest-validator compiled function
 * 
 * @returns {Function} middleware function
 * 
 * @example
 * import validator from 'fastest-validator'
 * apiValidateMiddleware(validator.compile(schema)) // middleware function
 */
export default function apiValidate(validateFunction, { allowEmpty = false } = {}) {
    return async (req, res, next) => {
        if (!typeof validateFunction === 'function')
            throw new Error('validateFunction must be a function')
        if (!allowEmpty && _.isEmpty(req.body)) {
            return response(res, {
                code: Code.EMPTY_INPUT_BODY
            })
        }
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
