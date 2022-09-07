import mongoose from 'mongoose'
import { schemaTypes } from './consts.model.mjs'
const { Schema, model } = mongoose

const ingredientSchema = new Schema(
    {
        name: schemaTypes.entityName,
        image: schemaTypes.image
    },
    {
        timestamps: {}
    }
)

export default model('Ingredient', ingredientSchema)
