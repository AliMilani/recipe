import _ from 'lodash'
import mongoose from 'mongoose'
import Controller from './controller.mjs'
import recipeService from '../services/recipe.service.mjs'
import subCategoryService from '../services/subCategory.service.mjs'
import categoryService from '../services/category.service.mjs'
import tagService from '../services/tag.service.mjs'
import chefService from '../services/chef.service.mjs'
import ingredientService from '../services/ingredient.service.mjs'
import { Code, RecipeDifficulty } from '../utils/consts.utils.mjs'
import pagination from '../utils/paggination.utils.mjs'
import { grantSlug, generateSlug } from '../utils/slug.utils.mjs'

class Recipe extends Controller {
    constructor() {
        super()
        this.self = this
    }
    #_generateComparativeStatements = (
        feild,
        conditions = ['gte', 'lte', 'gt', 'lt', 'eq', 'ne']
    ) => {
        const queryObj = _.mapKeys(_.pick(feild, conditions), (value, key) => `$${key}`)
        _.forEach(queryObj, (value, key) => {
            // if (!value || _.isNaN(parseInt(value))) {
            if (!value || /[^0-9]+/.test(value)) {
                delete queryObj[key]
            }
        })
        return queryObj
    }

    #recipeFilterGenerateQuery = async (query, feild) => {
        const dbQuery = {}
        const queryObj = _.pick(query, feild)
        if (_.has(queryObj, 'category.id'))
            dbQuery.category = {
                $in: _.get(queryObj, 'category.id')
                    .split(',')
                    .filter((id) => id && mongoose.isValidObjectId(id))
            }

        if (_.has(queryObj, 'category.slug')) {
            let categoryIds = _.compact([
                ...(await Promise.all(
                    _.map(_.get(queryObj, 'category.slug').split(','), (slug) =>
                        _.toLower(slug)
                    ).map(async (slug) => (await categoryService.findBySlug(slug))?._id)
                ))
            ]).map((categoryId) => categoryId.toString())

            _.isEmpty(dbQuery.category?.$in)
                ? (dbQuery.category = { $in: _.uniq(categoryIds) })
                : (dbQuery.category.$in = _.uniq([...dbQuery.category.$in, ...categoryIds]))

            if (_.isEmpty(dbQuery.category?.$in)) delete dbQuery.category
        }

        if (_.has(queryObj, 'sub_category.id'))
            dbQuery.subCategory = {
                $in: _.get(queryObj, 'sub_category.id')
                    .split(',')
                    .filter((id) => id && mongoose.isValidObjectId(id))
            }

        if (_.has(queryObj, 'sub_category.slug')) {
            let subCategoryIds = _.compact([
                ...(await Promise.all(
                    _.get(queryObj, 'sub_category.slug')
                        .split(',')
                        .map(async (slug) => (await subCategoryService.findBySlug(slug))?._id)
                ))
            ])
                // .filter((subCategoryId) => subCategoryId)
                .map((subCategoryId) => subCategoryId.toString())

            _.isEmpty(dbQuery.subCategory?.$in)
                ? (dbQuery.subCategory = { $in: _.uniq(subCategoryIds) })
                : (dbQuery.subCategory.$in = _.uniq(
                      _.compact([...dbQuery.subCategory.$in, ...subCategoryIds])
                  ))

            if (_.isEmpty(dbQuery.subCategory?.$in)) delete dbQuery.subCategory
        }

        if (_.has(queryObj, 'tag.id'))
            dbQuery.tags = {
                $in: queryObj.tag.id
                    .split(',')
                    .filter((tagId) => tagId && mongoose.isValidObjectId(tagId))
            }

        if (_.has(queryObj, 'tag.slug')) {
            let tagIds = _.compact([
                ...(await Promise.all(
                    _.get(queryObj, 'tag.slug')
                        .split(',')
                        .map(async (slug) => (await tagService.findBySlug(slug))?._id)
                ))
            ])
                // .filter((tagId) => mongoose.isValidObjectId(tagId))
                .map((tagId) => tagId.toString())

            // dbQuery.tags?.$in
            _.isEmpty(dbQuery.tags?.$in)
                ? (dbQuery.tags = { $in: _.uniq(tagIds) })
                : (dbQuery.tags.$in = _.uniq([...dbQuery.tags.$in, ...tagIds]))

            if (_.isEmpty(dbQuery.tags?.$in)) delete dbQuery.tags
        }

        if (_.has(queryObj, 'difficulty')) {
            dbQuery.difficulty = {
                $in: _.uniq(
                    queryObj.difficulty
                        .split(',')
                        .filter((difficulty) => difficulty && RecipeDifficulty[difficulty])
                )
            }
            if (_.isEmpty(dbQuery.difficulty?.$in)) delete dbQuery.difficulty
        }

        if (_.includes(['true', 'false'], queryObj.healthy))
            dbQuery.healthy = queryObj.healthy === 'true'

        if (_.has(queryObj, 'rate')) {
            dbQuery.rate = this.#_generateComparativeStatements(queryObj.rate)
            if (_.isEmpty(dbQuery.rate)) delete dbQuery.rate
        }

        if (_.has(queryObj, 'preparation_time')) {
            dbQuery.preparationTime = this.#_generateComparativeStatements(
                queryObj.preparation_time
            )
            if (_.isEmpty(dbQuery.preparationTime)) delete dbQuery.preparationTime
        }

        if (_.has(queryObj, 'cooking_time')) {
            dbQuery.cookingTime = this.#_generateComparativeStatements(queryObj.cooking_time)
            if (_.isEmpty(dbQuery.cookingTime)) delete dbQuery.cookingTime
        }
        if (_.has(queryObj, 'ingredient.id')) {
            dbQuery.ingredients = {
                $elemMatch: {
                    'ingredients.ingredientId': {
                        $in: queryObj.ingredient.id
                            .split(',')
                            .filter(
                                (ingredient) => ingredient && mongoose.isValidObjectId(ingredient)
                            )
                    }
                }
            }

            if (_.isEmpty(dbQuery.ingredients.$elemMatch['ingredients.ingredientId'].$in))
                delete dbQuery.ingredients
        }
        return dbQuery
    }

    #defaultRecipeFilterFields = [
        'category',
        'sub_category',
        'tag',
        'difficulty',
        'healthy',
        'rate',
        'preparation_time',
        'cooking_time',
        'ingredient'
    ]
    #defaultRecipeFilterPaginationOptions = {
        page: 1,
        limit: 10,
        populate: [
            {
                path: 'category',
                select: '-__v'
            },
            {
                path: 'subCategory',
                select: '-__v'
            },
            {
                path: 'tags',
                select: '-__v'
            },
            {
                path: 'chef',
                select: '-__v -createdAt -updatedAt'
            },
            {
                path: 'ingredients.ingredients',
                populate: {
                    path: 'ingredientId',
                    select: 'name image'
                }
            }
        ],
        select: {
            __v: 0,
            instructions: 0,
            photocomments: 0,
            nutritionalInfo: 0,
            createdAt: 0,
            updatedAt: 0,
            'ingredients.createdAt': 0,
            'ingredients.updatedAt': 0
        }
    }

    #getFilteredRecipesFromDB = async (
        dbQuery,
        { page = 1, limit = 10, aditionalQuery = {}, aditionalPaginationOptions = {} }
    ) => {
        // const dbQuery = this.#recipeFilterGenerateQuery(query, this.#recipeFilterFields)
        console.log(page, limit)
        const dbQueryWithAditionalQuery = { ...dbQuery, ...aditionalQuery }
        return await pagination('recipe', dbQueryWithAditionalQuery, {
            page: /[^0-9]+/.test(page) ? 1 : parseInt(page),
            limit: /[^0-9]+/.test(limit) ? (parseInt(limit) > 30 ? 30 : 10) : parseInt(limit),
            sort:
                aditionalPaginationOptions.sort || this.#defaultRecipeFilterPaginationOptions.sort,
            populate:
                aditionalPaginationOptions.populate ||
                this.#defaultRecipeFilterPaginationOptions.populate,
            select:
                aditionalPaginationOptions.select ||
                this.#defaultRecipeFilterPaginationOptions.select
        })
    }

    #checkRecipeObjectIds = async (recipe, res, { oldRecipe } = {}) => {
        let errors = []
        let category
        if (recipe.category) {
            category = await categoryService.findById(recipe.category)
            if (category === null)
                errors.push({
                    type: 'DB_ERROR',
                    message: `the category id ${recipe.category} does not exist in the database`,
                    field: 'category'
                    // actual: recipe.category
                })
        }
        let subCategory
        if (recipe.subCategory) {
            subCategory = await subCategoryService.findById(recipe.subCategory)

            if (subCategory === null)
                errors.push({
                    type: 'DB_ERROR',
                    message: `the sub category id ${recipe.subCategory} does not exist in the database`,
                    field: 'subCategory'
                    // actual: recipe.subCategory
                })
        }
        if (category === undefined && oldRecipe) category = oldRecipe.category.toString()

        if (
            subCategory &&
            category &&
            subCategory?.category?.toString() !== category?._id?.toString()
        ) {
            errors.push({
                type: 'DB_ERROR',
                message: `the sub category id ${recipe.subCategory} does not belong to the category id ${recipe.category}`,
                field: 'subCategory'
                // actual: recipe.subCategory
            })
        }
        let tags
        if (recipe.tags) {
            tags = await tagService.findByIds(recipe.tags)
            if (tags.length !== recipe.tags.length) {
                const missingTags = _.difference(
                    recipe.tags,
                    tags.map((tag) => tag._id.toString())
                )
                errors = errors.concat(
                    recipe.tags.reduce((acc, tag, index, tags) => {
                        if (missingTags.includes(tag)) {
                            let path = 'tags[' + index + ']'
                            return acc.concat({
                                type: 'DB_ERROR',
                                message: `${tag} is not exist in the database`,
                                field: path,
                                actual: recipe.tags
                                // actual: tag
                            })
                        } else {
                            return acc
                        }
                    }, [])
                )
            }
        }

        if (recipe.chef) {
            let chef = await chefService.findById(recipe.chef)
            if (chef === null)
                errors.push({
                    type: 'DB_ERROR',
                    message: `the chef id ${recipe.chef} does not exist in the database`,
                    field: 'chef'
                    // actual: recipe.chef
                })
        }
        if (recipe.ingredients) {
            const promises = recipe.ingredients.map((ingredientGroup, ingredientGroupIndex) =>
                ingredientGroup.ingredients.map(
                    async (ingredient, ingredientIndex) =>
                        new Promise(async (resolve, reject) => {
                            try {
                                if (
                                    (await ingredientService.findById(ingredient.ingredientId)) ===
                                    null
                                )
                                    errors.push({
                                        type: 'DB_ERROR',
                                        message: `the ingredient id ${ingredient.ingredientId} does not exist in the database`,
                                        field: `ingredients[${ingredientGroupIndex}].ingredients[${ingredientIndex}].ingredientId`
                                        // actual: ingredient.ingredientId
                                    })
                            } catch (err) {
                                reject(err)
                            }
                            resolve()
                        })
                )
            )
            await Promise.all(promises.flat())
        }

        if (errors.length > 0) {
            return this.self.response(res, {
                code: Code.INPUT_DATA_INVALID,
                errors: errors,
                info: 'recipe validation failed'
            })
        }
    }

    create = async (req, res) => {
        const recipe = req.body
        recipe.slug = await grantSlug('recipe', recipe.slug)
        // return this.self.response(res, { data: recipe })
        if (await this.#checkRecipeObjectIds(recipe, res)) return

        const createdRecipe = await recipeService.create(recipe)

        this.self.response(res, {
            data: createdRecipe,
            code: Code.CREATED
        })
    }

    get = async (req, res) => {
        const { query } = req

        const dbQuery = await this.#recipeFilterGenerateQuery(
            query,
            this.#defaultRecipeFilterFields
        )

        const targetRecipes = await this.#getFilteredRecipesFromDB(dbQuery, {
            page: query.page,
            limit: query.limit
        })

        this.self.response(res, {
            data: targetRecipes,
            code: Code.OK,
            info: {
                dbQuery
            }
        })
    }

    getById = async (req, res) => {
        const { id } = req.params
        const recipe = await recipeService.findById(id)
        if (recipe === null)
            return this.self.response(res, {
                code: Code.RECIPE_NOT_FOUND
            })

        return this.self.response(res, {
            data: recipe,
            code: Code.OK
        })
    }

    update = async (req, res) => {
        const { id } = req.params
        const recipe = req.body

        const oldRecipe = await recipeService.findById(id)
        if (oldRecipe === null)
            return this.self.response(res, {
                code: Code.RECIPE_NOT_FOUND
            })
        // console.warn((generateSlug(recipe.name) === oldRecipe.slug || recipe.slug === oldRecipe.slug));
        if (recipe?.slug?.length >= 1)
            recipe.slug =
                recipe.slug === oldRecipe.slug
                    ? oldRecipe.slug
                    : await grantSlug('recipe', recipe.slug, { excludeId: id })
        else recipe.slug = oldRecipe.slug

        if (await this.#checkRecipeObjectIds(recipe, res, { oldRecipe })) return

        const updatedRecipe = await recipeService.update(id, recipe)

        this.self.response(res, {
            data: updatedRecipe,
            code: Code.OK
        })
    }

    search = async (req, res) => {
        const { query } = req
        // ! FIXME: q query is required
        const dbQuery = await this.#recipeFilterGenerateQuery(
            query,
            this.#defaultRecipeFilterFields
        )
        const searchQuery = _.trim(query.q) || null
        console.log(searchQuery
            ? {
                $text: {
                    $search: searchQuery,
                    $caseSensitive: false
                }
            }
            : {})
        // ! FIXME: search query keyword should send in the body
        const targetRecipes = await this.#getFilteredRecipesFromDB(
            { dbQuery },
            {
                page: query.page,
                limit: query.limit,
                aditionalQuery: searchQuery
                    ? {
                          $text: {
                              $search: searchQuery,
                              $caseSensitive: false
                          }
                      }
                    : {},
                aditionalPaginationOptions: searchQuery
                ?{
                    select: {
                        score: {
                            $meta: 'textScore'
                        },
                        ...this.#defaultRecipeFilterPaginationOptions.select
                    },
                    sort: {
                        score: {
                            $meta: 'textScore'
                        }
                    }
                }:{}
            }
        )

        this.self.response(res, {
            data: { ...targetRecipes, q: searchQuery },
            code: Code.OK,
            info: {
                dbQuery
            }
        })
    }

    delete = async (req, res) => {
        const { id } = req.params
        const recipe = await recipeService.findById(id)
        if (recipe === null)
            return this.self.response(res, {
                code: Code.RECIPE_NOT_FOUND
            })

        await recipeService.delete(id)

        this.self.response(res, {
            code: Code.OK
        })
    }
}

export default new Recipe()
