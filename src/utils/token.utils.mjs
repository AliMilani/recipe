import jwt from 'jsonwebtoken'

export const createToken = (user) => {
    let userObj = {
        id: user._id.toString(),
        role: user.role,
        createdAt: user.createdAt,
    }
    return jwt.sign(userObj, process.env.JWT_SECRET, { expiresIn: '1d' })
}

export const verifyToken = (token) =>
    new Promise((resolve, reject) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            resolve(decoded)
        } catch (err) {
            reject(err)
        }
    })
