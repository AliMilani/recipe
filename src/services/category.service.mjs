import _ from 'lodash'
import categoryModel from '../models/category.model.mjs'

class Category {

    create = async (categoryObj) => await (await categoryModel.create(categoryObj)).save()

    findById = async (id) => await categoryModel.findById(id).select('-__v')

    findBySlug = async (slug) => await categoryModel.findOne({ slug }).select('-__v')

    find = async (query) => await categoryModel.find(query = {}).select('-__v')

    findAll = async () => await categoryModel.find({}).select('-__v')

    update = async (id, categoryObj) => await categoryModel.findByIdAndUpdate(id, categoryObj, { new: true }).select('-__v')

    delete = async (id) => await categoryModel.findByIdAndDelete(id)

}

export default new Category()
