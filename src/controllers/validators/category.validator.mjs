import Validator from 'fastest-validator'
import { addToAllSchemaProps } from '../../utils/validator.utils.mjs'
import { types, globalMessages } from './consts.validator.mjs'

const v = new Validator({
    useNewCustomCheckerFunction: true,
    messages: globalMessages
})

const createCategorySchema = {
    name: {
        type: 'string',
        min: 2,
        max: 50,
        trim: true,
        required: true
    },
    description: {
        type: 'string',
        trim: true,
        required: true
    },
    slug: {
        type: 'string',
        required: true,
        min: 1,
        max: 250,
    }
}

const updateCategorySchema = {
    ...addToAllSchemaProps(createCategorySchema, { optional: true }),
    $$strict: true
}


export const validateCreateCategory = v.compile(createCategorySchema)
export const validateUpdateCategory = v.compile(updateCategorySchema)
