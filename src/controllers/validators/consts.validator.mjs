import mongoose from 'mongoose'
import { UserType } from '../../utils/consts.utils.mjs'

export const types = {
    email: {
        type: 'email',
        min: 6,
        max: 254,
        messages: {
            required: 'پست الکترونیکی الزامی است'
        }
    },
    password: {
        type: 'string',
        min: 8,
        max: 255,
        messages: {
            required: 'رمز عبور الزامی است',
            stringMin: 'رمز عبور باید حداقل 8 کاراکتر باشد',
            stringMax: 'رمز عبور باید حداکثر 255 کاراکتر باشد',
            string: 'رمز عبور باید از نوع رشته باشد'
        }
    },
    role: {
        type: 'string',
        enum: [UserType.USER, UserType.ADMIN],
        messages: {
            stringEnum: 'نوع کاربر نادرست است'
        }
    },
    refreshToken: {
        type: 'string',
        length: 128,
        messages: {
            required: 'توکن بازیابی ضروری است.',
            stringLength: 'توکن بازیابی باید 128 کاراکتر باشد.',
            type: 'توکن بازیابی باید از نوع رشته باشد.'
        }
    },
    accessToken: {
        type: 'string',
        minLength: 200,
        optional: true,
        messages: {
            minLength: 'توکن دسترسی باید حداقل 200 کاراکتر باشد.',
            type: 'توکن دسترسی باید از نوع رشته باشد.'
        },

        $$async: true
    },
    passwordResetToken: {
        type: 'string',
        length: 16,
        messages: {
            length: 'توکن بازیابی باید 16 کاراکتر باشد',
            type: 'توکن بازیابی باید از نوع رشته باشد.',
            required: 'توکن بازیابی الزامی است',
            stringLength: 'توکن بازیابی باید 16 کاراکتر باشد'
        }
    },
    objectID: {
        type: 'objectID',
        ObjectID: mongoose.Types.ObjectId,
        messages: {
            objectID: 'آیدی نادرست است',
            type: 'آیدی باید از نوع رشته باشد.',
            required: 'آیدی الزامی است'
        }
    },
    image: {
        type: 'url',
        max: 2048,
        min: 6,
        custom: (v, errors) => {
            if (!/\.(jpe?g|png|gif|bmp|webp)$/i.test(v)) {
                errors.push({
                    type: 'image',
                    expected: 'jpg, jpeg, png, gif, bmp, webp',
                    actual: v,
                    message: 'فرمت تصویر نادرست است'
                })
            }
            return v
        },
        messages: {
            required: 'تصویر الزامی است',
            stringMax: 'آدرس تصویر باید حداکثر 2048 کاراکتر باشد',
            stringMin: 'آدرس تصویر باید حداقل 6 کاراکتر باشد',
            url: 'آدرس اینترنتی تصویر نادرست است'
        }
    }
}

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
    objectID: "'{field}' باید یک ابجکت ایدی معتبر باشد",
    url: '{field} باید یک آدرس اینترنتی معتبر باشد'
}
