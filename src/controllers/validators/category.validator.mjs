import Validator from 'fastest-validator'
import { addToAllSchemaProps, addLabelToSchemaType } from '../../utils/validator.utils.mjs'
import { types, globalMessages } from './consts.validator.mjs'

const v = new Validator({
    useNewCustomCheckerFunction: true,
    messages: globalMessages
})

const createCategorySchema = {
    name: types.entityName,
    description: types.description,
    slug: types.slug
}

const updateCategorySchema = addToAllSchemaProps(createCategorySchema, { optional: true })

export const validateCreateCategory = v.compile(createCategorySchema)
export const validateUpdateCategory = v.compile(updateCategorySchema)
