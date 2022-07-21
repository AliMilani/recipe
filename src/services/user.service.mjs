import UserModel from '../models/user.model.mjs'

class User {
    create = async (userObj) => await (await UserModel.create(userObj)).save()

    findByEmail = async (email) => await UserModel.findOne({ email })

    findById = async (id) => await UserModel.findById(id)

    update = async (id, userObj) => await UserModel.findOneAndUpdate({ _id: id }, userObj, { new: true })

    delete = async (id) => await UserModel.findOneAndDelete({ _id: id })
}

export default new User()
