import Validator from 'fastest-validator'
import { types, globalMessages } from './consts.validator.mjs'
import { addToAllSchemaProps, addLabelToSchemaType } from '../../utils/validator.utils.mjs'
import _ from 'lodash'

const v = new Validator({
    useNewCustomCheckerFunction: true,
    messages: globalMessages
})

const emailPassSchema = {
    email: types.email,
    password: types.password
}
const createUserSchema = {
    email: types.email,
    password: types.password,
    role: _.assign(types.role, { optional: true })
}

const updateUserSchema = addToAllSchemaProps(createUserSchema, { optional: true })

export const validateUserByPass = v.compile(emailPassSchema)
export const validateCreateUser = v.compile(createUserSchema)
export const validateUpdateUser = v.compile(updateUserSchema)
