import userModel from '../models/user.model.mjs'

class User {
    create = async (userObj) => await (await userModel.create(userObj)).save()

    findByEmail = async (email) => await userModel.findOne({ email })

    findById = async (id) => await userModel.findById(id)

    update = async (id, userObj) => await userModel.findOneAndUpdate({ _id: id }, userObj, { new: true })

    delete = async (id) => await userModel.findOneAndDelete({ _id: id })
}

export default new User()
