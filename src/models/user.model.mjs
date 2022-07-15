import pkg from 'mongoose';
const { Schema, model } = pkg;
import { UserType } from '../utils/consts.utils.mjs'
import { passwordHash } from '../utils/encrypt.utils.mjs'

const userSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String },
        role: { type: String, enum: Object.values(UserType) },
    },
    {
        timestamps: {}
    }
)

userSchema.pre('save', async function (next) {
    let user = this

    if (!user.isModified('password')) {
        return next()
    }

    user.password = await passwordHash(user.password)

    return next()
})

export default model('User', userSchema)
