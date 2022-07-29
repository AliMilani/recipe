import userModel from '../models/user.model.mjs'

class User {
    /**
     * - this function is used to create a new user
     * @param {Object} userObj user object
     * @param {String} userObj.email user email
     * @param {String} userObj.password user password
     * @param {!('USER'|'ADMIN')=} userObj.role user role
     * 
     * @returns {Promise<Object>} user object
     * 
     * @example
     * const user = await create({
     *     email: 'info@example.com',
     *     password: 'password',
     *     role: 'USER' // default is 'USER'
     * })
     */
    create = async (userObj) => await (await userModel.create(userObj)).save()

    /**
     * - this function is used to find a user by email
     * @param {String} email user email
     * 
     * @returns {Promise<Object> | Promise<null>} user object
     * 
     * @example
     * const user = await findByEmail('info@example.com')
     * //=> if user is not found, user will be null
     */
    findByEmail = async (email) => await userModel.findOne({ email })

    /**
     * - this function is used to find a user by id
     * @param {String} id user id
     * 
     * @returns {Promise<Object> | Promise<null>} user object
     * 
     * @example
     * const user = await findById('user id')
     * //=> if user is not found, user will be null
     */
    findById = async (id) => await userModel.findById(id)

    /**
     * - this function is used to find a user by id and update it
     * @param {String} id user id
     * @param {String} userObj user object
     * @param {String} userObj.email user email
     * @param {String} userObj.password user hashed password
     * @param {!('USER'|'ADMIN')=} userObj.role user role
     * @returns {Promise<Object> | Promise<null>} user object
     * 
     * @example
     * const user = await updateById('user id',{
     *    email: 'info@example.com',
     *    password: 'hashed password',
     *    role: 'USER' // default is 'USER'
     */
    update = async (id, userObj) => await userModel.findOneAndUpdate({ _id: id }, userObj, { new: true })

    /**
     * - this function is used to find a user by id and delete it
     * @param {String} id user id
     * 
     * @returns {Promise<Object> | Promise<null>} user object
     * 
     * @example
     * const user = await deleteById('user id')
     * //=> if user is not found, user will be null
     */
    delete = async (id) => await userModel.findOneAndDelete({ _id: id })
}

export default new User()
