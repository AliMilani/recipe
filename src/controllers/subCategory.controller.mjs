import _ from 'lodash'
import Controller from './controller.mjs'
import subCategoryService from '../services/subCategory.service.mjs'
import { Code } from '../utils/consts.utils.mjs'
import categoryService from '../services/category.service.mjs'
import { grantSlug } from '../utils/slug.utils.mjs'

class SubCategory extends Controller {
    constructor() {
        super()
        this.self = this
    }

    create = async (req, res) => {
        const subCategory = req.body
        subCategory.slug = await grantSlug('subCategory', subCategory.slug)
        // TODO: check the category exists or not (DB_ERROR)
        // in this case, we need to check if the slug is already in use
        const parentCategory = await categoryService.findById(subCategory.category)
        if (!parentCategory) {
            return this.self.response(res, {
                code: Code.PARENT_CATEGORY_NOT_FOUND,
            })
        }
        // the slug must be unique
        if (
            await subCategoryService.findByCategoryAndSlug(subCategory.category, subCategory.slug)
        ) {
            return this.self.response(res, {
                code: Code.CATEGORY_ALREADY_EXIST,
                info: 'Sub category slug already exists'
            })
        }

        let createdSubCategory = await subCategoryService.create(subCategory)

        this.self.response(res, {
            data: createdSubCategory,
            code: Code.CREATED
        })
    }

    findAll = async (req, res) => {
        const subCategories = await subCategoryService.findAll()

        this.self.response(res, {
            data: subCategories,
            code: Code.OK
        })
    }

    findById = async (req, res) => {
        const id = req.params.id
        const subCategory = await subCategoryService.findById(id)

        if (subCategory === null) {
            return this.self.response(res, {
                code: Code.SUB_CATEGORY_NOT_FOUND,
                info: `subCategory with id '${id}' not found`
            })
        }

        this.self.response(res, {
            data: subCategory,
            code: Code.OK
        })
    }

    update = async (req, res) => {
        const id = req.params.id
        const subCategory = req.body
     
        const oldSubCategory = await subCategoryService.findById(id)
        if (oldSubCategory === null)
            return this.self.response(res, {
                code: Code.SUB_CATEGORY_NOT_FOUND,
                info: `subCategory with id '${id}' not found`
            })

        if (subCategory?.slug?.length > 1)
            subCategory.slug =
                subCategory.slug === oldSubCategory.slug
                    ? oldSubCategory.slug
                    : await grantSlug('subCategory', subCategory.slug, { excludeId: id })
        else subCategory.slug = oldSubCategory.slug

        let category
        if (subCategory.category) {
            category = await categoryService.findById(subCategory.category)

            if (category === null) {
                return this.self.response(res, {
                    code: Code.CATEGORY_NOT_FOUND,
                    info: 'Category not found'
                })
            }
        }

        const subCategoryWithSameSlug = await subCategoryService.findByCategoryAndSlug(
            subCategory.category || oldSubCategory.category,
            subCategory.slug || oldSubCategory.slug
        )
        if (subCategoryWithSameSlug && subCategoryWithSameSlug._id.toString() !== id) {
            return this.self.response(res, {
                code: Code.CATEGORY_ALREADY_EXIST,
                info: 'Sub category slug already exists'
            })
        }

        const updatedSubCategory = await subCategoryService.update(id, subCategory)

        this.self.response(res, {
            data: updatedSubCategory,
            code: Code.OK
        })
    }

    delete = async (req, res) => {
        const id = req.params.id
        const subCategory = await subCategoryService.findById(id)

        if (subCategory === null) {
            return this.self.response(res, {
                code: Code.SUB_CATEGORY_NOT_FOUND,
                info: `subCategory with id '${id}' not found`
            })
        }

        await subCategoryService.delete(id)

        this.self.response(res, {
            code: Code.OK
        })
    }
}

export default new SubCategory()
