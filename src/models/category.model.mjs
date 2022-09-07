import mongoose from 'mongoose'
import { schemaTypes } from './consts.model.mjs'
const { Schema, model } = mongoose

const categorySchema = Schema({
    name: schemaTypes.entityName,
    description: schemaTypes.description,
    slug: schemaTypes.slug
})

export default model('Category', categorySchema)
