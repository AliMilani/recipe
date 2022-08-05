import mongoose from 'mongoose'
const { Schema, model } = mongoose
import { calculateCustomDate } from '../utils/date.utils.mjs'

const { PASSWORD_RESET_EXPIRATION_TIME } = process.env

const passwordResetSchema = new Schema({
    tokenHash: {
        type: String,
        required: true,
        immutable: true
    },
    userId: {
        type: String,
        required: true,
        immutable: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    invalidated: {
        type: Boolean,
        default: false
    }
})

const EXPIER_SECONDS =
    calculateCustomDate(PASSWORD_RESET_EXPIRATION_TIME).getTime() / 1000 -
    new Date().getTime() / 1000

passwordResetSchema.index({ createdAt: 1 }, { expireAfterSeconds: EXPIER_SECONDS })

export default model('Password_Reset', passwordResetSchema)
