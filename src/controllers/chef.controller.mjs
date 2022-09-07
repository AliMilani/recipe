import _ from 'lodash'
import Controller from './controller.mjs'
import chefService from '../services/chef.service.mjs'
import userService from '../services/user.service.mjs'
import { Code } from '../utils/consts.utils.mjs'
import { grantSlug } from '../utils/slug.utils.mjs'

class Chef extends Controller {
    constructor() {
        super()
        this.self = this
    }

    create = async (req, res) => {
        const chef = req.body
        chef.slug = await grantSlug('chef', chef.slug)

        const createdChef = await chefService.create(chef)

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

        const oldChef = await chefService.findById(id)
        if (oldChef === null)
            return this.self.response(res, {
                code: Code.CHEF_NOT_FOUND
            })

        if (chef?.slug?.length >= 1)
            chef.slug =
                chef.slug === oldChef.slug
                    ? oldChef.slug
                    : await grantSlug('chef', chef.slug, { excludeId: id })
        else chef.slug = oldChef.slug

        if (chef.userId && (await userService.findById(chef.userId)) === null)
            return this.self.response(res, {
                code: Code.USER_NOT_FOUND,
                info: `the userId ${chef.userId} does not exist`
            })

        const updatedChef = await chefService.update(id, chef)

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
