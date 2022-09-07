import Validator from 'fastest-validator'
import { types, globalMessages } from './consts.validator.mjs'
import { addToAllSchemaProps, addLabelToSchemaType } from '../../utils/validator.utils.mjs'
import _ from 'lodash'

const v = new Validator({
    useNewCustomCheckerFunction: true,
    messages: globalMessages
})

const createSubCategorySchema = {
    name: addLabelToSchemaType(types.entityName, 'نام زیر دسته بندی'),
    description: addLabelToSchemaType(types.description, 'توضیحات زیر دسته بندی'),
    slug: addLabelToSchemaType(types.slug, 'نامک زیر دسته بندی'),
    category: addLabelToSchemaType(types.objectID, 'شناسه دسته بندی')
}

const updateSubCategorySchema = addToAllSchemaProps(createSubCategorySchema, { optional: true })

export const validateCreateSubCategory = v.compile(createSubCategorySchema)
export const validateUpdateSubCategory = v.compile(updateSubCategorySchema)
