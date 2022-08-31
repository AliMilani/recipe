import _ from 'lodash'
import Controller from './controller.mjs'
import tagService from '../services/tag.service.mjs'
import { Code, RecipeTagType } from '../utils/consts.utils.mjs'

class Tag extends Controller {
    constructor() {
        super()
        this.self = this
    }

    create = async (req, res) => {
        const tag = req.body
        tag.slug = _.toLower(tag.slug)
        tag.tagType = tag.tagType || RecipeTagType.GENERAL

        let createdTag
        try {
            createdTag = await tagService.create(tag)
        } catch (error) {
            if (error.code === 11000 && error.keyPattern.slug) {
                return this.self.response(res, {
                    code: Code.SLUG_ALREADY_EXIST
                })
            }
            throw error
        }

        this.self.response(res, {
            data: createdTag,
            code: Code.CREATED
        })
    }

    findAll = async (req, res) => {
        const tags = await tagService.find()
        this.self.response(res, {
            data: tags,
            code: Code.OK
        })
    }

    findById = async (req, res) => {
        const { id } = req.params
        const tag = await tagService.findById(id)
        if (tag === null)
            return this.self.response(res, {
                code: Code.TAG_NOT_FOUND,
                info: `the tag with id ${id} was found`
            })

        this.self.response(res, {
            data: tag,
            code: Code.OK
        })
    }

    update = async (req, res) => {
        const { id } = req.params
        const tag = req.body
        tag.slug = _.toLower(tag.slug)

        if (await tagService.findById(id) === null)
            return this.self.response(res, {
                code: Code.TAG_NOT_FOUND,
                info: `the tag with id ${id} was found`
            })
        let updatedTag
        try {
            updatedTag = await tagService.update(id, tag)
        } catch (error) {
            if (error.code === 11000 && error.keyPattern.slug) {
                return this.self.response(res, {
                    code: Code.SLUG_ALREADY_EXIST,
                    info: `the tag with slug '${tag.slug}' already exist`
                })
            }
            throw error
        }
        return this.self.response(res, {
            data: updatedTag,
            code: Code.OK
        })
    }

    delete = async (req, res) => {
        const { id } = req.params
        const tag = await tagService.findById(id)
        if (tag === null)
            return this.self.response(res, {
                code: Code.TAG_NOT_FOUND,
                info: `the tag with id ${id} was not found`
            })

        await tagService.delete(id)
        this.self.response(res, {
            code: Code.OK
        })
    }
}

export default new Tag()
