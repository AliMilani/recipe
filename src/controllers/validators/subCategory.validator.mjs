import Validator from 'fastest-validator'
import { types, globalMessages } from './consts.validator.mjs'
import { addToAllSchemaProps } from '../../utils/validator.utils.mjs'

const v = new Validator({
    useNewCustomCheckerFunction: true,
    messages: globalMessages
})

const createSubCategorySchema = {
    name: {
        type: 'string',
        required: true,
        messages: {
            required: 'نام زیر دسته بندی الزامی است'
        }
    },
    description: {
        type: 'string',
        required: true
    },
    slug: {
        type: 'string',
        required: true,
        min: 1
    },
    category: types.objectID
}

const updateSubCategorySchema = {
    ...addToAllSchemaProps(createSubCategorySchema, { optional: true }),
    $$strict: true
}

export const validateCreateSubCategory = v.compile(createSubCategorySchema)
export const validateUpdateSubCategory = v.compile(updateSubCategorySchema)