import tokenModel from '../models/token.model.mjs'

class Token {
    create = async (tokenObj) => await (await tokenModel.create(tokenObj)).save()

    findByRefreshToken = async (rTokenHash) => await tokenModel.findOne({ rTokenHash })

    findByAccessToken = async (aTokenHash) => await tokenModel.findOne({ aTokenHash })

    findActiveSessions = async (userId) =>
        await tokenModel.find({
            $and: [
                { userId },
                { rEndLife: { $gt: new Date() } },
                { rValidUntil: { $gt: new Date() } }
            ]
        })

    // findById = async (id) => await tokenModel.findById(id)

    updateById = async (id, tokenObj) =>
        await tokenModel.findOneAndUpdate({ _id: id }, tokenObj, { new: true })

    deleteById = async (id) => await tokenModel.findOneAndDelete({ _id: id })
}

export default new Token()
