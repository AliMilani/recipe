import _ from 'lodash'
import tokenModel from '../models/token.model.mjs'

class Token {
    /**
     * - this function is used to create a new token
     * @param {Object} tokenObj token object
     * @param {String} tokenObj.rTokenHash refresh token hash
     * @param {String} tokenObj.aTokenHash access token hash
     * @param {Date} tokenObj.rValidUntil refresh token expiration date
     * @param {Date} tokenObj.rEndLife refresh token life time
     * @param {String} tokenObj.aTokenLastIP access token last IP
     * @param {String} tokenObj.userId user id
     * @param {!Number=} tokenObj.rTotalRotations refresh token total rotations
     * @param {!Number=} tokenObj.aTotalTimeExtensions total time extensions
     * @param {!String=} tokenObj.loginIP login IP
     * @param {!Boolean=} tokenObj.isActive is active
     * @param {!String=} tokenObj.aPreviousTokenHash previous access token hash
     * @param {!Number=} tokenObj.aPreviousTokenCreatedAt previous access token created at
     * @param {!String=} tokenObj.loginTime login time
     *
     * @returns {Promise<Object> | Promise<null>} token object
     *
     * @example
     * const token = await create(tokenId,{
     *     rTokenHash: 'refresh token hash',
     *     aTokenHash: 'access token hash',
     *     userId: 'user id',
     *     loginIP: '123.123.123.123',
     *     aTokenLastIP: '123.123.123.123',
     *     aTokenCreatedAt: 12512151251,
     * })
     * //=> if token is not found, token will be null and if token is updated, token will be returned
     */
    create = async (tokenObj) => await (await tokenModel.create(tokenObj)).save()

    /**
     * - this function is used to find a token by refresh token hash
     * @param {String} rTokenHash  refresh token hash
     * @param {Object} options options
     * @param {!Boolean=} options.onlyActiveTokens if true, only active tokens will be returned
     *
     * @returns {Promise<Object> | Promise<null>} token object
     *
     * @example
     * const token = await findByRefreshTokenHash('refresh token hash',{
     *      onlyActiveTokens: true // default is false
     *  })
     * //=> if token is not found, token will be null
     */
    findByRefreshToken = async (rTokenHash, { onlyActiveTokens = false } = {}) =>
        await tokenModel.findOne(
            _.merge(
                {
                    rTokenHash
                },
                onlyActiveTokens ? { isActive: true } : {}
            )
        )

    /**
     * - this function is used to find a token by access token hash
     * @param {String} aTokenHash - access token hash
     * @param {Object} options options
     * @param {!Boolean=} options.includePreviousToken include previous token
     * @param {!Boolean=} options.onlyActiveTokens if true, only active tokens will be returned
     *
     * @returns {Promise<Object> | Promise<null>} token object
     *
     * @example
     * const token = await findByAccessTokenHash('access token hash',{
     *      includePreviousToken: true, // default is false
     *      onlyActiveTokens: true // default is false
     *  })
     * //=> if token is not found, token will be null
     */
    findByAccessToken = async (
        aTokenHash,
        { includePreviousToken = false, onlyActiveTokens = false } = {}
    ) =>
        await tokenModel.findOne(
            _.merge(
                {
                    $or: [
                        { aTokenHash },
                        includePreviousToken ? { aPreviousTokenHash: aTokenHash } : {}
                    ]
                },
                onlyActiveTokens ? { isActive: true } : {}
            )
        )

    /**
     * - this function is used to find active tokns by user id
     * @param {String} userId  user id
     *
     * @returns {Promise<Object> | Promise<null>} token object
     *
     * @example
     * const token = await findByUserId('user id')
     * //=> if tokens are not found, token will be null
     */
    findUserActiveSessions = async (userId) =>
        await tokenModel.find({
            $and: [
                { userId },
                { isActive: true },
                { rEndLife: { $gt: new Date() } },
                { rValidUntil: { $gt: new Date() } }
            ]
        })

    /**
     * - this function is used to find a token by id and update it
     * @param {String} id token id
     * @param {Object} tokenObj token object
     * @param {!String=} tokenObj.rTokenHash refresh token hash
     * @param {!String=} tokenObj.aTokenHash access token hash
     * @param {!Number=} tokenObj.rTotalRotations refresh token total rotations
     * @param {!Number=} tokenObj.aTotalTimeExtensions total time extensions
     * @param {!Date=} tokenObj.rValidUntil refresh token expiration date
     * @param {!Date=} tokenObj.rEndLife refresh token life time
     * @param {!String=} tokenObj.aTokenLastIP access token last IP
     * @param {!String=} tokenObj.loginIP login IP
     * @param {!Boolean=} tokenObj.isActive is active
     * @param {!String=} tokenObj.aPreviousTokenHash previous access token hash
     * @param {!Number=} tokenObj.aPreviousTokenCreatedAt previous access token created at
     * @param {!String=} tokenObj.userId user id
     * @param {!String=} tokenObj.loginTime login time
     *
     * @returns {Promise<Object> | Promise<null>} token object
     *
     * @example
     * const token = await update(tokenId,{
     *     rTokenHash: 'refresh token hash',
     *     aTokenHash: 'access token hash',
     *     aTokenCreatedAt: 12512151251,
     *     rTotalRotations: 1,
     *     aTotalTimeExtensions: 1,
     *     aTokenLastIP: '123.123.123.123',
     *     aPreviousTokenHash: 'previous access token hash',
     *     aPreviousTokenCreatedAt: 12512151251,
     *     rValidUntil: new Date(),
     *     isActive: true,
     *     userId: 'user id',
     *     loginTime: new Date()
     * })
     * //=> if token is not found, token will be null and if token is updated, token will be returned
     */
    updateById = async (id, tokenObj) =>
        await tokenModel.findOneAndUpdate({ _id: id }, tokenObj, { new: true })

    /**
     * - this function is used to find a token by id and delete it
     * @param {String} id token id
     *
     * @returns {Promise<Object> | Promise<null>} token object
     *
     * @example
     * const token = await deleteById('token id')
     * //=> if token is not found, token will be null
     */
    deleteById = async (id) => await tokenModel.findOneAndDelete({ _id: id })
}

export default new Token()
