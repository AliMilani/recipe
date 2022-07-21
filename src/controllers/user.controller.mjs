import _ from 'lodash'
import Controller from './controller.mjs'
import userService from '../services/user.service.mjs'
import { validateCreateUser, validateUpdateUser } from './validators/user.validator.mjs'
import { setCodeResponse } from '../utils/functions.mjs'
import { Code } from '../utils/consts.utils.mjs'
import { passwordHash } from '../utils/encrypt.utils.mjs'

class User extends Controller {
    constructor() {
        super()
        this.self = this
    }

    create = async (req, res) => {
        const user = req.body

        // validate user
        const userValidation = await validateCreateUser(user)
        if (userValidation !== true) {
            const errors = userValidation.map((error) =>
                _.pick(error, ['field', 'type', 'message'])
            )
            setCodeResponse(Code.INPUT_DATA_INVALID)
            return this.self.response(res, {}, { errors, userValidation })
        }

        // create user
        const userObj = _.pick(user, ['email', 'role', 'password'])
        /* 
        If we don't lowercase the email, user can create a new user with a duplicate email 
        https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#user-ids
        */
        userObj.email = _.toLower(userObj.email)
        let createdUser
        try {
            createdUser = await userService.create(userObj)
        } catch (error) {
            if (error.code === 11000 && error.keyPattern.email) {
                setCodeResponse(Code.EMAIL_EXIST)
                return this.self.response(res, {}, {})
            }
            throw error
        }

        const cleanedUserObj = {
            ..._.pick(createdUser, ['email', 'role', 'createdAt', 'updatedAt']),
            id: createdUser._id
        }
        console.log(cleanedUserObj)

        setCodeResponse(Code.CREATED)
        return this.self.response(res, cleanedUserObj, {
            user: user,
            userObj: userObj,
            createdUser: createdUser,
            cleanedUserObj: cleanedUserObj
        })
    }

    findUserById = async (req, res) => {
        let id = req.params.id
        const user = await userService.findById(id)

        if (user === null) {
            setCodeResponse(Code.USER_NOT_FOUND)
            return this.self.response(res, {}, { id: id, user: user })
        }
        const cleanedUserObj = {
            ..._.pick(user, ['email', 'role', 'createdAt', 'updatedAt']),
            id: user._id
        }
        this.self.response(res, cleanedUserObj, { userObj: cleanedUserObj, user: user })
    }

    updateUserById = async (req, res) => {
        const id = req.params.id
        const user = req.body

        // validate user
        // check if request body is empty
        if (_.isEmpty(user)) {
            setCodeResponse(Code.INPUT_DATA_INVALID)
            return this.self.response(res, {}, { msg: 'User object is empty' })
        }
        const userValidation = await validateUpdateUser(user)
        if (userValidation !== true) {
            const errors = userValidation.map((error) =>
                _.pick(error, ['field', 'type', 'message'])
            )
            setCodeResponse(Code.INPUT_DATA_INVALID)
            return this.self.response(res, {}, { id: id, errors, userValidation })
        }

        // update user
        const userObj = _.pick(user, ['email', 'role', 'password'])
        /* 
        If we don't "lowercase" the email, user can create a new user with a duplicate email 
        https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#user-ids
        */
        userObj.email = _.toLower(userObj.email)
        // check if the password is modified and hash it
        if (userObj.password) {
            userObj.password = await passwordHash(userObj.password)
        }
        let updatedUser
        try {
            updatedUser = await userService.update(id, userObj)
        } catch (error) {
            if (error.code === 11000 && error.keyPattern.email) {
                setCodeResponse(Code.EMAIL_EXIST)
                return this.self.response(res, {}, {})
            }
            throw error
        }
        // check if the user doesn't exist in DB
        if (updatedUser === null) {
            setCodeResponse(Code.USER_NOT_FOUND)
            return this.self.response(res, {}, { id: id, user: user, updatedUser: updatedUser })
        }
        const cleanedUserObj = {
            ..._.pick(updatedUser, ['email', 'role', 'createdAt', 'updatedAt']),
            id: updatedUser._id
        }
        return this.self.response(res, cleanedUserObj, {
            user: user,
            userObj: userObj,
            updatedUser: updatedUser
        })
    }

    deleteUserById = async (req, res) => {
        const id = req.params.id
        const user = await userService.findById(id)

        // check if the user doesn't exist in DB
        if (user === null) {
            setCodeResponse(Code.USER_NOT_FOUND)
            return this.self.response(res, {}, { id: id, user: user })
        }
        let deletedUser = await userService.delete(id)
        const cleanedUserObj = {
            ..._.pick(deletedUser, ['email', 'role', 'createdAt', 'updatedAt']),
            id: deletedUser._id
        }
        return this.self.response(res, cleanedUserObj, {
            user: user,
            deletedUser: deletedUser
        })
    }

    me = async (req, res) => {
        if (!req.user) {
            setCodeResponse(Code.AUTH_IS_NOT_SET)
            return this.self.response(res, {}, {})
        }
        // console.log(req.user)
        const user = await userService.findById(req.user.id)
        if (user === null) {
            setCodeResponse(Code.USER_NOT_FOUND)
            return this.self.response(res, {}, { user: user })
        }
        const cleanedUserObj = {
            ..._.pick(user, ['email', 'role', 'createdAt', 'updatedAt']),
            id: user._id
        }
        return this.self.response(res, cleanedUserObj, {})
    }
}
export default new User()
