import mongoose from 'mongoose'
const { Schema, model } = mongoose

export const ingredientsGroupSchema = new Schema(
    {
        groupLabel: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 64
        },
        ingredients: [
            {
                ingredientId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Ingredient'
                },
                quantity: {
                    type: String,
                    // required: true
                }
            }
        ],
        // recipe: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'Recipe',
        //     required: true
        // }
    },
    {
        timestamps: {}
    }
)


export default model('IngredientsGroup', ingredientsGroupSchema)