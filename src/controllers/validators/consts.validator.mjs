import mongoose from 'mongoose'
import { UserType } from '../../utils/consts.utils.mjs'
import { generateSlug } from '../../utils/slug.utils.mjs'

export const types = Object.freeze({
    email: {
        type: 'email',
        min: 6,
        max: 254,
        lowercase: true,
        trim: true,
        label: 'پست الکترونیکی'
    },
    password: {
        type: 'string',
        min: 8,
        max: 255,
        label: 'رمز عبور'
    },
    role: {
        type: 'string',
        enum: [UserType.USER, UserType.ADMIN],
        messages: {
            stringEnum: 'نوع کاربر نادرست است'
        }
    },
    passwordResetToken: {
        type: 'string',
        length: 16,
        label: 'توکن بازیابی رمز عبور'
    },
    objectID: {
        type: 'objectID',
        ObjectID: mongoose.Types.ObjectId,
        label: 'شناسه'
    },
    image: {
        // TODO: if it required, it should return required error, not image error (ingredient in post)
        type: 'url',
        max: 2048,
        min: 6,
        custom: (v, errors) => {
            if (!/.*\/.*\.(jpe?g|png|gif|bmp|webp)$/i.test(v)) {
                errors.push({
                    type: 'image',
                    expected: 'jpg, jpeg, png, gif, bmp, webp',
                    actual: v,
                    message: 'فرمت تصویر نادرست است'
                })
            }
            return v
        },
        label: 'تصویر'
    },
    slug: {
        type: 'string',
        min: 1,
        max: 255,
        label: 'نامک',
        lowercase: true,
        trim: true,
        nameProp: 'name',
        custom: (v, errors, schema, name, parent, context) => {
            if (v === undefined) return v
            const slug = generateSlug(v)

            if (slug.length < schema.min) {
                if (context.data[schema.nameProp] !== undefined) {
                    const nameSlug = generateSlug(
                        context.data[schema.nameProp].slice(0, schema.max)
                    )
                    if (schema.min && nameSlug.length >= schema.min) return nameSlug
                }
                errors.push({
                    type: name,
                    actual: v,
                    message: 'نامک باید شامل حروف و اعداد باشد'
                })
            }
            return slug
        }
    },
    description: {
        type: 'string',
        label: 'توضیحات',
        max: 3000,
        trim: true
    },
    entityName: {
        type: 'string',
        min: 1,
        max: 150,
        trim: true
    },
    fullName: {
        type: 'string',
        min: 6,
        max: 70,
        trim: true,
        label: 'نام و نام خانوادگی'
    }
})

export const globalMessages = {
    objectStrict:
        'پارامتر {actual} مورد قبول نیست ، تنها موارد مشخص شده مثل {expected} مورد قبول است.',
    required: '{field} باید پر باشد',
    min: '{field} باید حداقل {expected} کاراکتر باشد',
    max: '{field} باید حداکثر {expected} کاراکتر باشد',
    length: '{field} باید {expected} کاراکتر باشد',
    pattern: '{field} نامعتبر است',
    string: '{field} باید یک رشته باشد',
    stringEmpty: '{field} نمیتواند خالی باشد',
    stringMin: '{field} باید حداقل {expected} کاراکتر باشد',
    stringMax: '{field} باید حداکثر {expected} کاراکتر باشد',
    stringEnum: '{field} باید یک رشته و یکی از این موارد باشد: {expected}',
    email: 'پست الکترونیکی نامعتبر است',
    emailMin: 'پست الکترونیکی باید حداقل 6 کاراکتر باشد',
    emailMax: 'پست الکترونیکی باید حداکثر 254 کاراکتر باشد',
    emailEmpty: 'پست الکترونیکی نباید خالی باشد',
    stringLength: '{field} باید {expected} کاراکتر باشد',
    objectID: '{field} باید یک ابجکت ایدی معتبر باشد',
    url: '{field} باید یک آدرس اینترنتی معتبر باشد',
    number: '{field} باید یک عدد باشد',
    numberNotEqual: '{field} نمی تواند برابر با {expected} باشد',
    numberPositive: '{field} باید یک عدد مثبت باشد',
    equalField: '{field} باید برابر با {expected} باشد'
    // TODO: add more messages
}
