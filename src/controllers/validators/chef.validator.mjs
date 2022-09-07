import Validator from 'fastest-validator'
import { addToAllSchemaProps, addLabelToSchemaType } from '../../utils/validator.utils.mjs'
import { types, globalMessages } from './consts.validator.mjs'

const v = new Validator({
    useNewCustomCheckerFunction: true,
    messages: globalMessages
})

const createChefSchema = {
    name: types.fullName,
    description: types.description,
    image: addLabelToSchemaType({ ...types.image, optional: true }, 'تصویر سرآشپز'),
    userId: addLabelToSchemaType(types.objectID, 'شناسه کاربر'),
    slug: types.slug
}
const updateChefSchema = {
    ...addToAllSchemaProps(createChefSchema, { optional: true })
}

export const validateCreateChef = v.compile(createChefSchema)
export const validateUpdateChef = v.compile(updateChefSchema)
