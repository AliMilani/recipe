import mongoose from 'mongoose'
const { Schema, model } = mongoose
import { RecipeTagType } from '../utils/consts.utils.mjs'

const tagSchema = Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: 2,
        maxlength: 50,
        trim: true
    },
    tagType: {
        type: String,
        enum: Object.values(RecipeTagType),
        default: RecipeTagType.GENERAL
    }
})
export default model('Tag', tagSchema)
