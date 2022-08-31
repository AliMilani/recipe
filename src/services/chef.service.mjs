import _ from 'lodash'
import chefModel from '../models/chef.model.mjs'

class Ingredient {
    create = async (chefObj) => await (await chefModel.create(chefObj)).save()

    findById = async (id) => await chefModel.findById(id).select('-__v -createdAt -updatedAt')

    findAll = async () => await chefModel.find().select('-__v -createdAt -updatedAt')

    update = async (id, chefObj) => await chefModel.findByIdAndUpdate(id, chefObj, { new: true }).select('-__v -createdAt -updatedAt')

    delete = async (id) => await chefModel.findByIdAndDelete(id).select('-__v')
}

export default new Ingredient()
