import Validator from 'fastest-validator'
import _ from 'lodash'
import { instructionsTypes, NUTRITIONAL_INFO, RecipeDifficulty } from '../../utils/consts.utils.mjs'
import { types, globalMessages } from './consts.validator.mjs'
import { addToAllSchemaProps } from '../../utils/validator.utils.mjs'
// import fs from 'fs'

const v = new Validator({
    useNewCustomCheckerFunction: true,
    messages: globalMessages,
})

const _nutritionalInfoItemsProps = _.mapValues(NUTRITIONAL_INFO, (val) => ({
    type: 'number',
    convert: true,
    empty: false
}))

const createRecipeSchema = {
    name: { type: 'string', min: 3, max: 64 },
    description: { type: 'string', min: 3, max: 64, optional: true },
    image: { ...types.image, optional: true },
    serving: { type: 'number', min: 1, optional: true, integer: true },
    difficulty: { type: 'string', enum: Object.values(RecipeDifficulty) },
    cookingTime: { type: 'number', min: 1, required: true, integer: true },
    preparationTime: { type: 'number', min: 1, required: true, integer: true },
    cost: { type: 'number', min: 1, required: true, integer: true },
    rate: { type: 'number', optional: true, integer: true },
    video: { type: 'array', items: { type: 'url' }, optional: true },
    photocomments: { type: 'array', items: types.objectID, optional: true },
    chef: { ...types.objectID, optional: true },
    nutritionalInfo: {
        type: 'object',
        props: {
            '100g': { type: 'object', props: _nutritionalInfoItemsProps, optional: true },
            serving: { type: 'object', props: _nutritionalInfoItemsProps, optional: true }
        }
    },
    healthy: { type: 'boolean' },
    servingUnit: { type: 'string' },
    note: { type: 'string', optional: true },
    ingredients: {
        type: 'array',
        items: {
            type: 'object',
            props: {
                groupLabel: { type: 'string', min: 3, max: 64 },
                ingredients: {
                    type: 'array',
                    items: {
                        type: 'object',
                        props: {
                            ingredientId: types.objectID,
                            quantity: { type: 'string', optional: true }
                        }
                    }
                }
            }
        }
    },
    instructions: {
        type: 'array',
        items: {
            type: 'object',
            props: {
                type: { type: 'string', enum: instructionsTypes },
                title: { type: 'string', max: 225 },
                text: { type: 'string' },
                images: {
                    type: 'array',
                    items: {
                        type: 'object',
                        props: {
                            kind: { type: 'string', enum: ['block'] },
                            image: types.image
                        }
                    },
                    default: []
                }
            }
        }
    },
    category: types.objectID,
    subCategory: types.objectID,
    tags: {
        type: 'array',
        items: types.objectID
    }
}

const updateRecipeSchema = {
    // ...makeAllOptional(createRecipeSchema),
    ...addToAllSchemaProps(createRecipeSchema, { optional: true, strict: true }),
    //strict
    $$strict: true
}

// fs.writeFileSync('test.json', JSON.stringify(updateRecipeSchema))
// console.log(updateRecipeSchema);
export const validateCreateRecipe = v.compile(createRecipeSchema)
export const validateUpdateRecipe = v.compile(updateRecipeSchema)
