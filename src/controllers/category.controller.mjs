import _ from 'lodash'
import Controller from './controller.mjs'
import categoryService from '../services/category.service.mjs'
import { Code } from '../utils/consts.utils.mjs'
import { grantSlug } from '../utils/slug.utils.mjs'

class Category extends Controller {
    constructor() {
        super()
        this.self = this
    }

    create = async (req, res) => {
        const category = req.body

        category.slug = await grantSlug('category', category.slug)

        const createdCategory = await categoryService.create(category)

        this.self.response(res, {
            data: createdCategory,
            code: Code.CREATED
        })
    }

    findAll = async (req, res) => {
        const categories = await categoryService.findAll()

        this.self.response(res, {
            data: categories,
            code: Code.OK
        })
    }

    findById = async (req, res) => {
        const id = req.params.id
        const category = await categoryService.findById(id)

        if (category === null) {
            return this.self.response(res, {
                code: Code.CATEGORY_NOT_FOUND,
                info: `Category with id '${id}' not found`
            })
        }

        this.self.response(res, {
            data: category,
            code: Code.OK
        })
    }

    update = async (req, res) => {
        const id = req.params.id
        const category = req.body

        const oldCategory = await categoryService.findById(id)
        if (oldCategory === null)
            return this.self.response(res, {
                code: Code.CATEGORY_NOT_FOUND
            })
        if (category?.slug?.length >= 1)
            category.slug =
                category.slug === oldCategory.slug
                    ? oldCategory.slug
                    : await grantSlug('category', category.slug, { excludeId: id })
        else category.slug = oldCategory.slug

        const updatedCategory = await categoryService.update(id, category)

        if (updatedCategory === null) {
            return this.self.response(res, {
                code: Code.CATEGORY_NOT_FOUND,
                info: `Category with id '${id}' not found`
            })
        }

        this.self.response(res, {
            data: updatedCategory,
            code: Code.OK
        })
    }

    delete = async (req, res) => {
        const id = req.params.id
        const category = await categoryService.findById(id)

        if (category === null) {
            return this.self.response(res, {
                code: Code.CATEGORY_NOT_FOUND,
                info: `Category with id '${id}' not found`
            })
        }

        await categoryService.delete(id)

        this.self.response(res, {
            code: Code.OK
        })
    }
}

export default new Category()
