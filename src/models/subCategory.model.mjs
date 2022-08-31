import mongoose from 'mongoose'
import subCategoryService from '../services/subCategory.service.mjs'
const { Schema, model } = mongoose

const subCategorySchema = Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 50,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        // unique: true,
        // validate: {
        //     async function(v) {
        //         return await subCategoryService.findByCategoryAndSlug(this.category, v) === null
        //     },
        //     message: (props) => `${props.value} is not a valid quest category id.`
        // }
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
})
// subCategorySchema.pre('save', function (next) {

export default model('SubCategory', subCategorySchema)
