import mongoose from 'mongoose'
const { Schema, model } = mongoose

const chefSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 255
        },
        description: {
            type: String,
            minlength: 3,
            maxlength: 3000,
        },
        image: {
            type: String,
            default: '/images/chefs/default.png'
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        slug: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: {}
    }
)

export default model('Chef', chefSchema)
