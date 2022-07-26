import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export const createAccessToken = (user) => {
    let userObj = {
        id: user._id.toString(),
        role: user.role,
        createdAt: user.createdAt,
        tokenCreatedAt: new Date().getTime(),
    }
    console.log(userObj);
    return jwt.sign(userObj, process.env.TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME
    })
}

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

export const generateHash = (token) =>
    crypto.createHmac('sha256', process.env.TOKEN_SECRET).update(token.toString()).digest('hex')
