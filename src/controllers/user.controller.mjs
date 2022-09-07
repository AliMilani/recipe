import _ from 'lodash'
import Controller from './controller.mjs'
import userService from '../services/user.service.mjs'
import { Code } from '../utils/consts.utils.mjs'
import { passwordHash } from '../utils/encrypt.utils.mjs'

class User extends Controller {
    constructor() {
        super()
        this.self = this
    }

    create = async (req, res) => {
        const user = req.body

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
                return this.self.response(res, {
                    code: Code.EMAIL_EXIST,
                    info: { userObj, error }
                })
            }
            throw error
        }

        const cleanedUserObj = {
            ..._.pick(createdUser, ['email', 'role']),
            id: createdUser._id
        }

        return this.self.response(res, {
            data: cleanedUserObj,
            code: Code.CREATED,
            info: {
                user,
                userObj,
                createdUser,
                cleanedUserObj
            }
        })
    }

    findUserById = async (req, res) => {
        const id = req.params.id
        const user = await userService.findById(id)

        if (user === null) {
            return this.self.response(res, {
                code: Code.USER_NOT_FOUND,
                info: { id: id, user: user }
            })
        }
        const cleanedUserObj = {
            ..._.pick(user, ['email', 'role']),
            id: user._id
        }
        this.self.response(res, {
            data: cleanedUserObj,
            info: { userObj: cleanedUserObj, user: user }
        })
    }

    updateUserById = async (req, res) => {
        const id = req.params.id
        const user = req.body

        // check if request body is empty
        if (_.isEmpty(user)) {
            return this.self.response(res, {
                info: 'User object is empty',
                code: Code.INPUT_DATA_INVALID
            })
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
                return this.self.response(res, {
                    code: Code.EMAIL_EXIST,
                    info: { id: id, userObj, error }
                })
            }
            throw error
        }
        // check if the user doesn't exist in DB
        if (updatedUser === null) {
            return this.self.response(res, {
                info: { id: id, user: user, updatedUser: updatedUser },
                code: Code.USER_NOT_FOUND
            })
        }
        const cleanedUserObj = {
            ..._.pick(updatedUser, ['email', 'role']),
            id: updatedUser._id
        }
        return this.self.response(res, {
            data: cleanedUserObj,
            info: {
                user: user,
                userObj: userObj,
                updatedUser: updatedUser
            }
        })
    }

    deleteUserById = async (req, res) => {
        const id = req.params.id
        const user = await userService.findById(id)

        // check if the user doesn't exist in DB
        if (user === null) {
            return this.self.response(res, {
                code: Code.USER_NOT_FOUND,
                info: { id: id, user: user }
            })
        }
        const deletedUser = await userService.delete(id)
        const cleanedUserObj = {
            ..._.pick(deletedUser, ['email', 'role']),
            id: deletedUser._id
        }
        return this.self.response(res, {
            data: cleanedUserObj,
            info: {
                user: user,
                deletedUser: deletedUser
            }
        })
    }

    me = async (req, res) => {
        if (!req.user) {
            return this.self.response(res, {
                code: Code.AUTH_IS_NOT_SET
            })
        }

        const user = await userService.findById(req.user.id)
        if (user === null) {
            return this.self.response(res, {
                info: { user: user },
                code: Code.USER_NOT_FOUND
            })
        }
        const cleanedUserObj = {
            ..._.pick(user, ['email', 'role']),
            id: user._id
        }
        return this.self.response(res, {
            data: cleanedUserObj
        })
    }
}
export default new User()
