import _ from 'lodash'
import ingredientModel from '../models/ingredient.model.mjs'

class Ingredient {
    create = async (ingredientObj) => await (await ingredientModel.create(ingredientObj)).save()

    findAll = async () => await ingredientModel.find().select('-__v -createdAt -updatedAt')

    findById = async (id) => await ingredientModel.findById(id).select('-__v -createdAt -updatedAt')

    update = async (id, ingredientObj) => await ingredientModel.findByIdAndUpdate(id, ingredientObj, { new: true })

    delete = async (id) => await ingredientModel.findByIdAndDelete(id)

}

export default new Ingredient()
