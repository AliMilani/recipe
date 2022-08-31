import mongoose from 'mongoose'
const { Schema, model } = mongoose

const ingredientSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            default: '/images/ingredient.png'
        }
    },
    {
        timestamps: {}
    }
)

export default model('Ingredient', ingredientSchema)
