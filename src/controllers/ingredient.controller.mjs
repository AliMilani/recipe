import _ from 'lodash'
import Controller from './controller.mjs'
import ingredientService from '../services/ingredient.service.mjs'
import { Code } from '../utils/consts.utils.mjs'

class Ingredient extends Controller {
    constructor() {
        super()
        this.self = this
    }

    create = async (req, res) => {
        const ingredient = req.body
        ingredient.slug = _.toLower(ingredient.slug)

        // let createdIngredient
        // try {
        let createdIngredient = await ingredientService.create(ingredient)
        // } catch (error) {
        //     if (error.code === 11000 && error.keyPattern.slug) {
        //         return this.self.response(res, {
        //             code: Code.INGREDIENT_ALREADY_EXIST,
        //         })
        //     }
        //     throw error
        // }

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
