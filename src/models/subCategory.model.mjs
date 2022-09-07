import mongoose from 'mongoose'
import subCategoryService from '../services/subCategory.service.mjs'
const { Schema, model } = mongoose
import { schemaTypes } from './consts.model.mjs'

const subCategorySchema = Schema({
    name: schemaTypes.entityName,
    description: schemaTypes.description,
    slug: schemaTypes.slug,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
})
// subCategorySchema.pre('save', function (next) {

export default model('SubCategory', subCategorySchema)
