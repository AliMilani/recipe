import _ from 'lodash'
import subCategoryModel from '../models/subCategory.model.mjs'

class SubCategory {

    create = async (categoryObj) => await (await subCategoryModel.create(categoryObj)).save()

    findAll = async () => await subCategoryModel.find().select('-__v')

    findById = async (id) => await subCategoryModel.findById(id).select('-__v')

    findBySlug = async (slug) => await subCategoryModel.findOne({ slug }).select('-__v')

    findByCategoryAndSlug = async (category, slug) => await subCategoryModel.findOne({ category, slug }).select('-__v')

    update = async (id, categoryObj) => await subCategoryModel.findByIdAndUpdate(id, categoryObj, { new: true }).select('-__v')

    delete = async (id) => await subCategoryModel.findByIdAndDelete(id)

}

export default new SubCategory()
