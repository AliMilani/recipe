import _ from 'lodash'
import recipeModel from '../models/recipe.model.mjs'

class Recipe {
    create = async (recipeObj) => await (await recipeModel.create(recipeObj)).save()

    find = async (query) => await recipeModel.find(query)

    findById = async (id) => await recipeModel.findById(id).populate([
        {
            path: 'category',
            select: '-__v'
        },
        {
            path: 'subCategory',
            select: '-__v'
        },
        {
            path: 'tags',
            select: '-__v'
        },
        {
            path: 'chef',
            select: '-__v -createdAt -updatedAt'
        },
        {
            path: 'ingredients.ingredients',
            populate: {
                path: 'ingredientId',
                select: 'name image'
            }
        }
    ]).select({
        __v: 0,
        'ingredients.createdAt': 0,
        'ingredients.updatedAt': 0
    })

    update = async (id, recipeObj) =>
        await recipeModel.findByIdAndUpdate(id, recipeObj, { new: true })

    delete = async (id) => await recipeModel.findByIdAndDelete(id)
}

export default new Recipe()
