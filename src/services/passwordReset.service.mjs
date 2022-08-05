import _ from 'lodash'
import passwordResetModel from '../models/passwordReset.model.mjs'

class PasswordReset {
    /**
     * - this function will create a new password reset token
     * @param {Object} passwordResetObj password reset object
     * @param {String} passwordResetObj.tokenHash password reset token hash
     * @param {String} passwordResetObj.userId user id
     * 
     * @returns {Promise<Object>} password reset object
     * 
     * @example
     * await create({
     *    tokenHash: 'bc26b6e9923760ee9641cab204ff02c68c5162d69b2ff33ff0a790078138c9f6',
     *    userId: '22e29da3124f655f727499a2'
     * })
     */
    create = async ({ tokenHash, userId }) =>
        await (await passwordResetModel.create({ tokenHash, userId })).save()

    /**
     * - this function will find a password reset token by token hash
     * @param {String} tokenHash password reset token hash
     * 
     * @returns {Promise<Object> | Promise<null>} password reset object
     * 
     * @example
     * const passwordReset = await findByTokenHash('bc26b6e9923760ee9641cab204ff02c68c5162d69b2ff33ff0a790078138c9f6')
     * //=> if tokenHash is not found, password reset will be null
     */
    findByTokenHash = async (tokenHash) => await passwordResetModel.findOne({ tokenHash })

    /**
     * - this function will delete a password reset token by token hash
     * @param {String} tokenHash password reset token hash
     * 
     * @returns {Promise<Object> | Promise<null>} password reset object
     * 
     * @example
     * await deleteByTokenHash('bc26b6e9923760ee9641cab204ff02c68c5162d69b2ff33ff0a790078138c9f6')
     * //=> if tokenHash is not found, password reset will be null
     */
    deleteByTokenHash = async (tokenHash) => await passwordResetModel.deleteOne({ tokenHash })

    /**
     * - this function will find all password reset tokens by user id
     * @param {String} userId user id
     * 
     * @returns {Promise<Array> | Promise<null>} password reset object
     * 
     * @example
     * const passwordReset = await findAllByUserId('22e29da3124f655f727499a2')
     * //=> if userId is not found, password reset will be null
     */
    findAllByUserId = async (userId) => await passwordResetModel.find({ userId })

    /**
     * - this function will invalidate all password reset tokens by user id
     * @param {String} userId user id
     * 
     * @returns {Promise<Array> | Promise<null>} invalidated password reset tokens
     * 
     * @example
     * const passwordReset = await invalidateAllByUserId('22e29da3124f655f727499a2')
     * //=> if userId is not found, password reset will be null
     */
    invalidateAllByUserId = async (userId) =>
        await passwordResetModel.updateMany({ userId }, { invalidated: true })
}

export default new PasswordReset()
