import mongoose from 'mongoose'
const { Schema, model } = mongoose
import { RecipeTagType } from '../utils/consts.utils.mjs'
import { schemaTypes } from './consts.model.mjs'

const tagSchema = Schema({
    name: schemaTypes.entityName,
    slug: schemaTypes.slug,
    tagType: {
        type: String,
        enum: Object.values(RecipeTagType),
        default: RecipeTagType.GENERAL
    }
})
export default model('Tag', tagSchema)
