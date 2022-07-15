import Validator from 'fastest-validator'

const v = new Validator({
    useNewCustomCheckerFunction: true, // using new version
    // Register our new error message text
    atLeastOneLetter: 'at least one letter',
    atLeastOneDigit: 'at least one digit'
})
const emailPassSchema = {
    email: { type: 'email', min: 6, max: 254, optional: false },
    password: { type: 'string', min: 8, max: 255, optional: false },
    $$async: true
}

export const validateUserByPass = v.compile(emailPassSchema)
