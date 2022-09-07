import _ from 'lodash'
import Controller from './controller.mjs'
import tagService from '../services/tag.service.mjs'
import { Code, RecipeTagType } from '../utils/consts.utils.mjs'
import { grantSlug } from '../utils/slug.utils.mjs'

class Tag extends Controller {
    constructor() {
        super()
        this.self = this
    }

    create = async (req, res) => {
        const tag = req.body
        tag.slug = await grantSlug('tag', tag.slug)
        tag.tagType = tag.tagType || RecipeTagType.GENERAL

        const createdTag = await tagService.create(tag)

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

        const oldTag = await tagService.findById(id)
        if (oldTag === null)
            return this.self.response(res, {
                code: Code.TAG_NOT_FOUND,
                info: `the tag with id ${id} was found`
            })
        if (tag?.slug?.length >= 1)
            tag.slug =
                tag.slug === oldTag.slug
                    ? oldTag.slug
                    : await grantSlug('tag', tag.slug, { excludeId: id })
        else tag.slug = oldTag.slug

        const updatedTag = await tagService.update(id, tag)

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
