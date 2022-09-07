import mongoose from 'mongoose'
const { Schema, model } = mongoose
import { schemaTypes } from './consts.model.mjs'

const chefSchema = new Schema(
    {
        name: schemaTypes.fullName,
        description: schemaTypes.description,
        image: schemaTypes.image,
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        slug: schemaTypes.slug
    },
    {
        timestamps: {}
    }
)

export default model('Chef', chefSchema)
