export const Code = {
    OK: {
        msgCode: 200,
        mes: 'عملیات موفقیت آمیز بود',
        status: 200
    },
    CREATED: {
        msgCode: 201,
        mes: 'عملیات موفقیت آمیز بود',
        status: 201
    },
    JSON_SYNTAX_ERROR: {
        msgCode: 40001,
        mes: 'JSON syntax error',
        devMes: 'JSON syntax error',
        status: 400
    },
    INVALID_ID: {
        msgCode: 40002,
        mes: 'آیدی نامعتبر است',
        status: 400
    },
    EMPTY_INPUT_BODY: {
        msgCode: 40003,
        mes: 'دیتای ورودی معتبر نیست',
        devMes: 'Input body is empty',
        status: 400
    },
    UNAUTHORIZED: {
        msgCode: 40101,
        mes: 'عدم دسترسی',
        status: 401
    },
    REFRESH_TOKEN_EXPIRED: {
        msgCode: 40102,
        mes: 'عدم احراز هویت',
        devMes: 'refresh token is expired',
        status: 401
    },
    ACCESS_TOKEN_NOT_SET: {
        msgCode: 40103,
        mes: 'عدم احراز هویت',
        devMes: 'access token is not set',
        status: 401
    },
    ACCESS_TOKEN_EXPIRED: {
        msgCode: 40104,
        mes: 'عدم احراز هویت',
        devMes: 'access token is expired',
        status: 401
    },
    ACCESS_TOKEN_INVALID: {
        msgCode: 40105,
        mes: 'عدم احراز هویت',
        devMes: 'access token is invalid',
        status: 401
    },
    TOKEN_EXPIRED: {
        msgCode: 40106,
        mes: 'عدم احراز هویت',
        devMes: 'token is expired',
        status: 401
    },
    LOGIN_INVALID: {
        msgCode: 40107,
        mes: 'ورود موفقیت آمیز نبود',
        status: 401
    },
    USER_NOT_ADMIN: {
        msgCode: 40301,
        mes: 'عدم دسترسی',
        devMes: 'user must have admin privilege',
        status: 403
    },
    USER_NOT_FOUND: {
        msgCode: 40401,
        mes: 'کاربر یافت نشد',
        status: 404
    },
    CATEGORY_NOT_FOUND: {
        msgCode: 40402,
        mes: 'دسته بندی یافت نشد',
        status: 404
    },
    SUB_CATEGORY_NOT_FOUND: {
        msgCode: 40403,
        mes: 'زیر دسته بندی یافت نشد',
        status: 404
    },
    TAG_NOT_FOUND: {
        msgCode: 40404,
        mes: 'تگ یافت نشد',
        status: 404
    },
    RECIPE_NOT_FOUND: {
        msgCode: 40405,
        mes: 'دستور پخت یافت نشد',
        status: 404
    },
    INGREDIENT_NOT_FOUND: {
        msgCode: 40406,
        mes: 'ماده اولیه یافت نشد',
        status: 404
    },
    CHEF_NOT_FOUND: {
        msgCode: 40407,
        mes: 'سرآشپز یافت نشد',
        status: 404
    },
    TOKEN_DOES_NOT_EXIST: {
        msgCode: 40601,
        mes: 'دیتای ورودی معتبر نیست',
        devMes: 'توکن وجود ندارد',
        status: 406
    },
    SLUG_ALREADY_EXIST: {
        msgCode: 40901,
        mes: 'نامک تکراری است',
        status: 409
    },
    EMAIL_EXIST: {
        msgCode: 40902,
        mes: 'ایمیل تکراری است',
        status: 409
    },
    CATEGORY_ALREADY_EXIST: {
        msgCode: 40903,
        mes: 'دسته بندی تکراری است',
        status: 409
    },
    TAG_ALREADY_EXIST: {
        msgCode: 40904,
        mes: 'تگ تکراری است',
        status: 409
    },
    INGREDIENT_ALREADY_EXIST: {
        msgCode: 40905,
        mes: 'ماده اولیه تکراری است',
        status: 409
    },
    CHEF_ALREADY_EXIST: {
        msgCode: 40906,
        mes: 'سرآشپز تکراری است',
        status: 409
    },
    PASSWORD_ALREADY_USED: {
        msgCode: 40907,
        mes: 'رمزعبور قبلا استفاده شده است',
        status: 409
    },
    PARENT_CATEGORY_NOT_FOUND: {
        msgCode: 40908,
        mes: 'دسته بندی والد اشتباه است',
        devMes: 'Parent category not found',
        status: 409
    },
    PASSWORD_RESET_TOKEN_EXPIRED: {
        msgCode: 41001,
        mes: 'توکن تغییر رمزعبور منقضی شده است',
        status: 410
    },
    PAYLOAD_TOO_LARGE: {
        msgCode: 41301,
        mes: 'Request entity too large',
        devMes: 'Request entity too large',
        status: 413
    },
    INPUT_DATA_INVALID: {
        msgCode: 42201,
        mes: 'دیتای ورودی معتبر نیست',
        status: 422
    },
    REFRESH_TOKEN_NOT_SET: {
        msgCode: 42202,
        mes: 'عدم احراز هویت',
        devMes: 'refresh token is not set',
        status: 422
    },
    TOO_MANY_REQUEST: {
        msgCode: 42902,
        mes: 'You sent too many requests. Please wait a while then try again',
        status: 429
    },
    SERVER_ERROR: {
        msgCode: 50001,
        mes: 'خطایی در سرور رخ داده است',
        status: 500
    },
    DATABASE_ERROR: {
        msgCode: 50002,
        mes: 'خطایی در سرور رخ داده است',
        devMes: 'خطایی در دیتابیس رخ داده است',
        status: 500
    },
    EMAIL_ERROR: {
        msgCode: 50003,
        mes: 'خطایی در ارسال ایمیل رخ داده است',
        status: 500
    },
    ROUTE_NOT_FOUND: {
        msgCode: 50101,
        mes: 'route not found',
        status: 501
    }
}

export const UserType = Object.freeze({
    USER: 'USER',
    ADMIN: 'ADMIN',
    AUTHOR: 'AUTHOR',
    CHEF: 'CHEF'
})

export const RecipeDifficulty = Object.freeze({
    VERY_EASY: 'VERY_EASY',
    EASY: 'EASY',
    MEDIUM: 'MEDIUM',
    HARD: 'HARD',
    VERY_HARD: 'VERY_HARD'
})

export const RecipeTagType = Object.freeze({
    DIET: 'DIET',
    COOKING_TYPE: 'COOKING_TYPE',
    CUISINE_TYPE: 'CUISINE_TYPE',
    GENERAL: 'GENERAL'
})

export const NUTRITIONAL_INFO = {
    kcal: { type: Number },
    carb: { type: Number },
    sugar: { type: Number },
    prot: { type: Number },
    fat: { type: Number },
    sat_fat: { type: Number },
    fiber: { type: Number },
    chol: { type: Number },
    na: { type: Number }
}

export const instructionsTypes = ['intro', 'preparation', 'conservation', 'advice', 'generic']
