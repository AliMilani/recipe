import Validator from 'fastest-validator'
import { addToAllSchemaProps } from '../../utils/validator.utils.mjs'
import { types, globalMessages } from './consts.validator.mjs'

const v = new Validator({
    useNewCustomCheckerFunction: true,
    messages: globalMessages
})

const createChefSchema = {
    name: {
        type: 'string',
        minlength: 3,
        maxlength: 255
    },
    description: {
        type: 'string',
        minlength: 3,
        maxlength: 3000,
        optional: true
    },
    image: { ...types.image, optional: true },
    userId: types.objectID,
    slug: {
        type: 'string',
        minlength: 3,
        maxlength: 255,
    }
}
const updateChefSchema = {
    ...addToAllSchemaProps(createChefSchema, { optional: true })
}

export const validateCreateChef = v.compile(createChefSchema)
export const validateUpdateChef = v.compile(updateChefSchema)
