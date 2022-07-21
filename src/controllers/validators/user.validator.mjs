import Validator from 'fastest-validator'
import { types, globalMessages } from './consts.validator.mjs'

const v = new Validator({
    useNewCustomCheckerFunction: true,
    messages: {
        ...globalMessages,
        objectStrict: 'پارامتر {actual} مورد قبول نیست.'
    }
})

const emailPassSchema = {
    email: types.email,
    password: types.password,
    $$async: true,
    $$strict: true
}
const createUserSchema = {
    email: types.email,
    password: types.password,
    role: { ...types.role, optional: true },
    $$async: true,
    $$strict: true
}
const updateUserSchema = {
    email: { ...types.email, optional: true },
    password: { ...types.password, optional: true },
    role: { ...types.role, optional: true },
    $$async: true,
    // $$strict: "remove"
    $$strict: true
}

export const validateUserByPass = v.compile(emailPassSchema)
export const validateCreateUser = v.compile(createUserSchema)
export const validateUpdateUser = v.compile(updateUserSchema)
