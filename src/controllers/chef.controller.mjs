import _ from 'lodash'
import Controller from './controller.mjs'
import chefService from '../services/chef.service.mjs'
import userService from '../services/user.service.mjs'
import { Code } from '../utils/consts.utils.mjs'

class Chef extends Controller {
    constructor() {
        super()
        this.self = this
    }

    create = async (req, res) => {
        const chef = req.body
        chef.slug = _.toLower(chef.slug)

        let createdChef
        try {
            createdChef = await chefService.create(chef)
        } catch (error) {
            if (error.code === 11000 && error.keyPattern.slug) {
                return this.self.response(res, {
                    code: Code.SLUG_ALREADY_EXIST
                })
            }
            throw error
        }

        this.self.response(res, {
            data: createdChef,
            code: Code.CREATED
        })
    }

    findAll = async (req, res) => {
        const chefs = await chefService.findAll()
        this.self.response(res, {
            data: chefs,
            code: Code.OK
        })
    }

    findById = async (req, res) => {
        const { id } = req.params
        const chef = await chefService.findById(id)
        if (chef === null)
            return this.self.response(res, {
                code: Code.CHEF_NOT_FOUND
            })
        return this.self.response(res, {
            data: chef,
            code: Code.OK
        })
    }

    update = async (req, res) => {
        const { id } = req.params
        const chef = req.body
        chef.slug = _.toLower(chef.slug)

        if ((await chefService.findById(id)) === null)
            return this.self.response(res, {
                code: Code.CHEF_NOT_FOUND
            })

        if (chef.userId && (await userService.findById(chef.userId)) === null)
            return this.self.response(res, {
                code: Code.USER_NOT_FOUND,
                info: `the userId ${chef.userId} does not exist`
            })

        // if (chef.slug && (await chefService.findBySlug(chef.slug)) !== null)
        //     return this.self.response(res, {
        //         code: Code.SLUG_ALREADY_EXIST,
        //         info: `the slug '${chef.slug}' already used`
        //     })

        let updatedChef
        try {
            updatedChef = await chefService.update(id, chef)
        } catch (error) {
            if (error.code === 11000 && error.keyPattern.slug) {
                return this.self.response(res, {
                    code: Code.SLUG_ALREADY_EXIST
                })
            }
            throw error
        }

        this.self.response(res, {
            data: updatedChef,
            code: Code.OK
        })
    }

    delete = async (req, res) => {
        const { id } = req.params

        if ((await chefService.findById(id)) === null)
            return this.self.response(res, {
                code: Code.CHEF_NOT_FOUND
            })

        await chefService.delete(id)
        this.self.response(res, {
            code: Code.OK
        })
    }
}

export default new Chef()
