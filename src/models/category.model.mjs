import mongoose from 'mongoose'
const { Schema, model } = mongoose

const categorySchema = Schema({
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
        minlength: 1,
        maxlength: 250,
        trim: true,
        unique: true
    }
})

export default model('Category', categorySchema)
