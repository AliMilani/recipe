import _ from 'lodash'
import Controller from './controller.mjs'
import categoryService from '../services/category.service.mjs'
import { Code } from '../utils/consts.utils.mjs'

class Category extends Controller {
    constructor() {
        super()
        this.self = this
    }

    create = async (req, res) => {
        const category = req.body

        category.slug = _.toLower(category.slug)
        let createdCategory
        try {
            createdCategory = await categoryService.create(category)
        } catch (error) {
            if (error.code === 11000 && error.keyPattern.slug) {
                return this.self.response(res, {
                    code: Code.CATEGORY_ALREADY_EXIST
                })
            }
            throw error
        }

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

        category.slug = _.toLower(category.slug)

        let updatedCategory
        try {
            updatedCategory = await categoryService.update(id, category)
        } catch (error) {
            if (error.code === 11000 && error.keyPattern.slug) {
                return this.self.response(res, {
                    code: Code.SLUG_ALREADY_EXIST,
                    info: { error }
                })
            }
            throw error
        }

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
