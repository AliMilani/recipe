import _ from 'lodash'
import recipeModel from '../models/recipe.model.mjs'

class Recipe {
    create = async (recipeObj) => await (await recipeModel.create(recipeObj)).save()

    find = async (query) => await recipeModel.find(query)

    findById = async (id) => await recipeModel.findById(id)

    update = async (id, recipeObj) => await recipeModel.findByIdAndUpdate(id, recipeObj, { new: true })

    delete = async (id) => await recipeModel.findByIdAndDelete(id)
}

export default new Recipe()
