import Validator from 'fastest-validator'
import { types, globalMessages } from './consts.validator.mjs'
import { addToAllSchemaProps, addLabelToSchemaType } from '../../utils/validator.utils.mjs'

const v = new Validator({
    useNewCustomCheckerFunction: true,
    messages: globalMessages
})

const createIngredientSchema = {
    name: addLabelToSchemaType(types.entityName, 'نام ماده اولیه'),
    image: { ...types.image, optional: true }
}

const updateIngredientSchema = {
    ...addToAllSchemaProps(createIngredientSchema, { optional: true })
}

export const validateCreateIngredient = v.compile(createIngredientSchema)
export const validateUpdateIngredient = v.compile(updateIngredientSchema)
