import mongoose from 'mongoose'
const { Schema, model } = mongoose
import subCategoryModel from './subCategory.model.mjs'
import { RecipeDifficulty, NUTRITIONAL_INFO } from '../utils/consts.utils.mjs'
import { ingredientsGroupSchema } from './ingredientsGroup.model.mjs'

const recipeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 64
        },
        description: {
            type: String,
            minlength: 3,
            maxlength: 3000,
            default: null
        },
        image: {
            type: String,
            maxlength: 2048,
            default: null
        },
        serving: {
            type: Number,
            min: 1,
            default: null
        },
        difficulty: {
            type: String,
            required: true,
            enum: Object.values(RecipeDifficulty)
        },
        cookingTime: {
            type: Number,
            min: 1,
            required: true
        },
        preparationTime: {
            type: Number,
            min: 1,
            required: true
        },
        cost: {
            type: Number,
            min: 1,
            required: true
        },
        rate: {
            type: Number
        },
        video: [mongoose.Schema.Types.ObjectId],
        photocomments: [mongoose.Schema.Types.ObjectId],
        chef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chef',
            default: null
        },
        nutritionalInfo: {
            // type: Object,
            // required: true,
            '100g': NUTRITIONAL_INFO,
            serving: NUTRITIONAL_INFO
        },
        healthy: {
            type: Boolean,
            required: true
        },
        servingUnit: {
            type: String,
            required: true
        },
        note: {
            type: String,
            defualt: ''
        },
        ingredients: {
            type: [ingredientsGroupSchema],
            required: true
        },
        instructions: [
            {
                type: {
                    type: String,
                    enum: ['intro', 'preparation', 'conservation', 'advice', 'generic'],
                    required: true
                },
                title: {
                    type: String,
                    required: true,
                    maxlength: 225
                },
                text: {
                    type: String,
                    required: true
                },
                images: [
                    {
                        kind: {
                            type: String,
                            enum: ['block']
                        },
                        image: String
                    }
                ]
            }
        ],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
            // required: true
        },
        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory'
            // required: true
        },
        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tag'
            }
        ]
    },
    {
        timestamps: {}
    }
)

recipeSchema.pre('save', async function (next) {
    if (this.SubCategory) {
        try {
            const check = await subCategoryModel.findById(this.SubCategory)
            if (!check || JSON.stringify(check.Category) !== JSON.stringify(this.Category)) {
                throw new Error('Check your Category and/or SubCategory')
            }
        } catch (error) {
            throw error
        }
    }
    next()
})

recipeSchema.index(
    {
        name: 'text',
        description: 'text',
        category: 'text',
        subCategory: 'text',
        'instructions.text': 'text'
    },
    {
        weights: { name: 5, description: 3, category: 1, subCategory: 1, 'instructions.text': 1 },
    }
)

export default model('Recipe', recipeSchema)
