import _ from 'lodash'
import tagModel from '../models/tag.model.mjs'

class Tag {

    create = async (tagObj) => await (await tagModel.create(tagObj)).save()

    findBySlug = async (slug) => await tagModel.findOne({ slug })

    findById = async (id) => await tagModel.findById(id).select('-__v')

    findByIds = async (ids) => await tagModel.find({ _id: { $in: ids } })

    find = async (query) => await tagModel.find(query = {}).select('-__v')

    update = async (id, tagObj) => await tagModel.findByIdAndUpdate(id, tagObj, { new: true }).select('-__v')

    delete = async (id) => await tagModel.findByIdAndDelete(id)

}

export default new Tag()
