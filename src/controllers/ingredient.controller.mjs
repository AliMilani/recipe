import _ from 'lodash'
import Controller from './controller.mjs'
import ingredientService from '../services/ingredient.service.mjs'
import { Code } from '../utils/consts.utils.mjs'
import { grantSlug } from '../utils/slug.utils.mjs'

class Ingredient extends Controller {
    constructor() {
        super()
        this.self = this
    }

    create = async (req, res) => {
        const ingredient = req.body

        ingredient.slug = await grantSlug('ingredient', ingredient.slug)

        let createdIngredient = await ingredientService.create(ingredient)

        this.self.response(res, {
            data: createdIngredient,
            code: Code.CREATED
        })
    }

    findAll = async (req, res) => {
        const ingredients = await ingredientService.findAll()
        this.self.response(res, {
            data: ingredients,
            code: Code.OK
        })
    }

    findById = async (req, res) => {
        const id = req.params.id
        const ingredient = await ingredientService.findById(id)
        if (ingredient === null)
            return this.self.response(res, {
                code: Code.INGREDIENT_NOT_FOUND
            })
        return this.self.response(res, {
            data: ingredient,
            code: Code.OK
        })
    }

    update = async (req, res) => {
        const { id } = req.params
        const ingredient = req.body

        const oldIngredient = await ingredientService.findById(id)
        if (oldIngredient === null)
            return this.self.response(res, {
                code: Code.INGREDIENT_NOT_FOUND
            })
        // FIXME: remove slug (because it is not found in mongoose schema and validator)
        if (ingredient?.slug?.length >= 1)
            ingredient.slug =
                ingredient.slug === oldIngredient.slug
                    ? oldIngredient.slug
                    : await grantSlug('ingredient', ingredient.slug, { excludeId: id })
        else ingredient.slug = oldIngredient.slug

        const updatedIngredient = await ingredientService.update(id, ingredient)
        if (updatedIngredient === null)
            return this.self.response(res, {
                code: Code.INGREDIENT_NOT_FOUND
            })
        return this.self.response(res, {
            data: updatedIngredient,
            code: Code.OK
        })
    }

    delete = async (req, res) => {
        const { id } = req.params
        const ingredient = await ingredientService.delete(id)
        if (ingredient === null)
            return this.self.response(res, {
                code: Code.INGREDIENT_NOT_FOUND
            })
        return this.self.response(res, {
            code: Code.OK
        })
    }
}

export default new Ingredient()
