import mongoose from 'mongoose'
const { Schema, model } = mongoose
import { calculateCustomDate } from '../utils/date.utils.mjs'

const { REFRESH_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_LIFETIME } = process.env
if (!REFRESH_TOKEN_EXPIRATION_TIME || !REFRESH_TOKEN_LIFETIME)
    throw new Error('REFRESH_TOKEN_EXPIRATION_TIME or REFRESH_TOKEN_LIFETIME is not defined')

const tokenSchema = new Schema(
    {
        rTokenHash: {
            type: String,
            required: true,
            unique: true
        },
        aTokenHash: {
            type: String,
            required: true,
            unique: true
        },
        rTotalRotations: {
            type: Number,
            default: 0,
            min: 0
        },
        aTotalTimeExtensions: {
            type: Number,
            default: 0,
            min: 0
        },
        aTokenCreatedAt: {
            type: Number,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rValidUntil: {
            type: Date,
            default: calculateCustomDate(REFRESH_TOKEN_EXPIRATION_TIME),
            required: true,
            validate: {
                validator: (value) => value.getTime() > new Date().getTime(),
                message: 'Refresh token expiration date must be in the future'
            }
        },
        rEndLife: {
            type: Date,
            default: calculateCustomDate(REFRESH_TOKEN_LIFETIME),
            required: true,
            immutable: true,
            validate: {
                validator: (value) =>
                    value.getTime() > new Date().getTime() &&
                    value.getTime() > calculateCustomDate(REFRESH_TOKEN_EXPIRATION_TIME).getTime(),

                message:
                    'Refresh token life time must be in the future and greater than refresh token expiration time.'
            }
            // expires: calculateCustomDate(REFRESH_TOKEN_LIFETIME)
        },
        aTokenLastIP: {
            type: String,
            required: true
        },
        loginIP: {
            type: String,
            default: ''
        },
        loginTime: {
            type: Date,
            default: Date.now()
        },
        isActive: {
            type: Boolean,
            default: true
        },
        aPreviousTokenHash: {
            type: String,
            default: ''
        },
        aPreviousTokenCreatedAt: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: {}
    }
)

export default model('Token', tokenSchema)
