import Validator from 'fastest-validator'
import { globalMessages, types } from './consts.validator.mjs'
import { RecipeTagType as tagType } from '../../utils/consts.utils.mjs'
import { addToAllSchemaProps, addLabelToSchemaType } from '../../utils/validator.utils.mjs'
import _ from 'lodash'

const v = new Validator({
    useNewCustomCheckerFunction: true,
    messages: globalMessages
})

const createTagSchema = {
    name: addToAllSchemaProps(types.entityName, 'نام برچسب'),
    slug: addToAllSchemaProps(types.slug, 'نامک برچسب'),
    tagType: {
        label: 'نوع برچسب',
        type: 'string',
        enum: Object.values(tagType)
    }
}

const updateTagSchema = addToAllSchemaProps(createTagSchema, { optional: true })

export const validateCreateTag = v.compile(createTagSchema)
export const validateUpdateTag = v.compile(updateTagSchema)
