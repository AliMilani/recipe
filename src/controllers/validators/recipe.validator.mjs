import Validator from 'fastest-validator'
import _ from 'lodash'
import { instructionsTypes, NUTRITIONAL_INFO, RecipeDifficulty } from '../../utils/consts.utils.mjs'
import { types, globalMessages } from './consts.validator.mjs'
import { addToAllSchemaProps, addLabelToSchemaType } from '../../utils/validator.utils.mjs'

const v = new Validator({
    useNewCustomCheckerFunction: true,
    messages: globalMessages
})

const _nutritionalInfoItemsProps = _.mapValues(NUTRITIONAL_INFO, (value, key) => ({
    type: 'number',
    convert: true,
    empty: false,
    label: `مقدار ${key}`
}))
const createRecipeSchema = {
    // $$async: true,
    name: addLabelToSchemaType(types.entityName, 'نام دستور پخت'),
    slug: { ...types.slug, label: 'نامک دستور پخت' },
    description: _.assign(types.description, { optional: true }),
    image: _.assign(types.image, { optional: true }),
    serving: { type: 'number', min: 1, optional: true, integer: true, label: 'تعداد نفرات' },
    difficulty: { type: 'string', enum: Object.values(RecipeDifficulty), label: 'سطح سختی' },
    cookingTime: { type: 'number', min: 1, required: true, integer: true, label: 'زمان پخت' },
    preparationTime: {
        type: 'number',
        min: 1,
        required: true,
        integer: true,
        label: 'زمان آماده سازی'
    },
    cost: { type: 'number', min: 1, required: true, integer: true, label: 'هزینه' },
    rate: { type: 'number', min: 1, max: 5, optional: true, integer: true, label: 'امتیاز' },
    video: {
        type: 'array',
        items: {
            type: 'url', // TODO: video format validation
            label: 'آدرس ویدیو'
        },
        optional: true,
        label: 'ویدیو'
    },
    photocomments: {
        type: 'array',
        items: types.objectID,
        optional: true,
        label: 'نظرات تصویر دار'
    },
    chef: addLabelToSchemaType({ ...types.objectID, optional: true }, 'سرآشپز'),
    nutritionalInfo: {
        type: 'object',
        label: 'اطلاعات غذایی',
        // strict: true,
        props: {
            '100g': { type: 'object', props: _nutritionalInfoItemsProps, optional: true },
            serving: { type: 'object', props: _nutritionalInfoItemsProps, optional: true }
        }
    },
    healthy: { type: 'boolean', label: 'سالم' },
    servingUnit: { type: 'string', label: 'واحد تعداد نفرات' },
    note: { type: 'string', optional: true, label: 'یادداشت' },
    ingredients: {
        type: 'array',
        label: 'مواد لازم',
        items: {
            type: 'object',
            props: {
                groupLabel: { type: 'string', min: 3, max: 64, label: 'عنوان بخش مواد لازم' },
                ingredients: {
                    type: 'array',
                    items: {
                        type: 'object',
                        label: 'ماده اولیه',
                        props: {
                            ingredientId: types.objectID,
                            quantity: { type: 'string', optional: true, label: 'مقدار' }
                        }
                    }
                }
            }
        }
    },
    instructions: {
        type: 'array',
        label: 'دستورات پخت',
        items: {
            type: 'object',
            props: {
                type: { type: 'string', enum: instructionsTypes, label: 'نوع بخش دستور پخت' },
                title: { type: 'string', max: 225, label: 'عنوان بخش دستور پخت' },
                text: { type: 'string', label: 'متن بخش دستور پخت' }, // TODO: max length
                images: {
                    type: 'array',
                    items: {
                        type: 'object',
                        label: 'تصویر بخش دستور پخت',
                        props: {
                            kind: { type: 'string', enum: ['block'], label: 'نوع تصویر' },
                            image: types.image
                        }
                    },
                    default: []
                }
            }
        }
    },
    category: addLabelToSchemaType(types.objectID, 'دسته بندی'),
    subCategory: addLabelToSchemaType(types.objectID, 'زیر دسته بندی'),
    tags: addLabelToSchemaType({ type: 'array', items: types.objectID }, 'برچسب ها')
    //TODO: add published field or post status [draft, published]
}

const updateRecipeSchema = {
    ...addToAllSchemaProps(createRecipeSchema, { optional: true, strict: true }),
    $$strict: true
}

export const validateCreateRecipe = v.compile(createRecipeSchema)
export const validateUpdateRecipe = v.compile(updateRecipeSchema)
