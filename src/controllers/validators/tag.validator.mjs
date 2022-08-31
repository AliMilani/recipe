import Validator from 'fastest-validator'
import { globalMessages } from './consts.validator.mjs'
import { RecipeTagType as tagType } from '../../utils/consts.utils.mjs'
import { addToAllSchemaProps } from '../../utils/validator.utils.mjs'

const v = new Validator({
    useNewCustomCheckerFunction: true,
    messages: globalMessages
})

const createTagSchema = {
    name: {
        type: 'string',
        min: 2,
        max: 50,
        required: true,
        messages: {
            required: 'نام تگ الزامی است'
        }
    },
    slug: {
        type: 'string',
        min: 2,
        max: 50,
        required: true,
    },
    tagType: {
        type: 'string',
        enum: Object.values(tagType),
        // default: tagType.GENERAL,
    }
}

const updateTagSchema = {
    ...addToAllSchemaProps(createTagSchema, { optional: true })
}

export const validateCreateTag = v.compile(createTagSchema)
export const validateUpdateTag = v.compile(updateTagSchema)
