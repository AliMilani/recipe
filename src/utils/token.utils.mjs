import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { customAlphabet } from 'nanoid'

/**
 * - generate JWT access token
 * @param {Object} user User object
 * @param {String} user._id User id
 * @param {String} user.role User role
 * @param {String} user.createdAt User createdAt
 * 
 * @returns {String} JWT access token
 */
export const createAccessToken = (user) => {
    let userObj = {
        id: user._id.toString(),
        role: user.role,
        createdAt: user.createdAt,
        tokenCreatedAt: new Date().getTime()
    }

    return jwt.sign(userObj, process.env.TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME
    })
}

/**
 * verify JWT access token and decode it
 * @param {String} token JWT access token
 * 
 * @returns {Object } User object
 */
export const verifyAccessToken = (token) =>
    new Promise((resolve, reject) => {
        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
            resolve(decoded)
        } catch (err) {
            reject(err)
        }
    })

export const createRefreshToken = () => crypto.randomBytes(64).toString('hex')

/**
 * This function generates hash value with TOKEN_SECRET based on sha256
 * @param {String} token
 * @param {!String=} [tokenSecret = process.env.TOKEN_SECRET] TOKEN_SECRET is a secret key that is used to generate hash value
 * @returns {String} hash value
 *
 * @example
 *
 * generateTokenHash('123456789qwerty',process.env.TOKEN_SECRET)
 * //=> sha256 hash value f1c4edae4fe6cff92cbc11cc00129d043e531810988c18f06374804bfac36ceb
 */
export const generateTokenHash = (token, tokenSecret = process.env.TOKEN_SECRET) =>
    crypto.createHmac('sha256', tokenSecret).update(token.toString()).digest('hex')

/**
 * This function generates a password reset token 16 characters long
 * @returns {String} password reset token (nanoid)
 * 
 * @example
 * 
 * generatePasswordResetToken() //=> vPGwYpVcD8mBekNd
 */
export const generatePasswordResetToken = () => {
    const alphabet = '23456789ABCDEFGHKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz' // alphabet without unreadable characters
    const TOKEN_LENGTH = 16
    const nanoid = customAlphabet(alphabet, TOKEN_LENGTH)
    return nanoid()
}
