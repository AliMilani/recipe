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
    IS_LOGIN: {
        msgCode: 202,
        mes: 'شما لاگین هستید',
        status: 202
    },
    UNAUTHORIZED: {
        msgCode: 40101,
        mes: 'عدم دسترسی',
        status: 401
    },
    REFRESH_TOKEN_NOT_SET: {
        msgCode: 40102,
        mes: 'عدم احراز هویت',
        devMes: 'refresh token is not set',
        status: 401
    },
    REFRESH_TOKEN_EXPIRED: {
        msgCode: 40103,
        mes: 'عدم احراز هویت',
        devMes: 'refresh token is expired',
        status: 401
    },
    REFRESH_TOKEN_INVALID: {
        msgCode: 40104,
        mes: 'عدم احراز هویت',
        devMes: 'refresh token is invalid',
        status: 401
    },
    ACCESS_TOKEN_NOT_SET: {
        msgCode: 40105,
        mes: 'عدم احراز هویت',
        devMes: 'access token is not set',
        status: 401
    },
    ACCESS_TOKEN_EXPIRED: {
        msgCode: 40106,
        mes: 'عدم احراز هویت',
        devMes: 'access token is expired',
        status: 401
    },
    ACCESS_TOKEN_INVALID: {
        msgCode: 40107,
        mes: 'عدم احراز هویت',
        devMes: 'access token is invalid',
        status: 401
    },
    TOKEN_EXPIRED: {
        msgCode: 40108,
        mes: 'عدم احراز هویت',
        devMes: 'token is expired',
        status: 401
    },
    AUTHENTICATION_FAILED: {
        msgCode: 40109,
        mes: 'عدم احراز هویت',
        devMes: 'عدم احراز هویت',
        status: 401
    },
    USER_NOT_ADMIN: {
        msgCode: 40110,
        mes: 'عدم دسترسی',
        devMes: 'user must have admin privilege',
        status: 401
    },
    USER_NOT_FOUND: {
        msgCode: 40402,
        mes: 'کاربر یافت نشد',
        status: 404
    },
    ROUTE_NOT_FOUND: {
        msgCode: 40403,
        mes: 'route not found',
        status: 404
    },
    NO_PRODUCT: {
        msgCode: 40404,
        mes: 'محصولی وجود ندارد',
        status: 404
    },
    NO_ORDER: {
        msgCode: 40405,
        mes: 'سفارش وجود ندارد',
        status: 404
    },
    EMAIL_NOT_FOUND: {
        msgCode: 40406,
        mes: 'ایمیل یافت نشد',
        status: 404
    },
    DATA_NOT_FOUND: {
        msgCode: 40401,
        mes: 'داده یافت نشد',
        devMes: 'داده یافت نشد یا کاربر به این داده دسترسی ندارد',
        status: 404
    },
    INPUT_DATA_INVALID: {
        msgCode: 40601,
        mes: 'دیتای ورودی معتبر نیست',
        status: 406
    },
    PASSWORD_PATTERN_INVALID: {
        msgCode: 40602,
        mes: 'رمزعبور شامل ۸ کاراکتر انگلیسی شامل حداقل یک عدد و حداقل یک حرف باشد',
        status: 406
    },
    EMAIL_EXIST: {
        msgCode: 40603,
        mes: 'ایمیل تکراری است',
        status: 406
    },
    SIGN_UP_INVALID: {
        msgCode: 40604,
        mes: 'ثبتنام موفقیت آمیز نبود',
        status: 406
    },
    LOGIN_INVALID: {
        msgCode: 40605,
        mes: 'ورود موفقیت آمیز نبود',
        status: 406
    },
    PASSWORD_NOT_MATCH: {
        msgCode: 40606,
        mes: 'اطلاعات وارد شده صحیح نمیباشد',
        devMes: 'رمزعبور با تکرار آن مطابقت ندارد',
        status: 406
    },
    TOKEN_DOES_NOT_EXIST: {
        msgCode: 40607,
        mes: 'دیتای ورودی معتبر نیست',
        devMes: 'توکن وجود ندارد',
        status: 406
    },
    TOO_MUCH_LOGIN: {
        msgCode: 42901,
        mes: 'تعداد درخواست ورود بیشتر از مقدار مجاز است',
        status: 429
    },
    TOO_MANY_REQUEST: {
        msgCode: 42902,
        mes: 'You sent too many requests. Please wait a while then try again',
        status: 429
    },
    PASSWORD_RESET_FAILED: {
        msgCode: 50001,
        mes: 'تغییر رمز عبور موفقیت آمیز نبود',
        status: 500
    },
    EDIT_PROFILE_FAILED: {
        msgCode: 50002,
        mes: 'ویرایش پروفایل موفقیت آمیز نبود',
        status: 500
    },
    DATABASE_ERROR: {
        msgCode: 50003,
        mes: 'خطایی در سرور رخ داده است',
        devMes: 'خطایی در دیتابیس رخ داده است',
        status: 500
    },
    SERVER_ERROR: {
        msgCode: 50004,
        mes: 'خطایی در سرور رخ داده است',
        status: 500
    },
    EMAIL_DID_NOT_SENT: {
        msgCode: 50005,
        mes: 'ایمیل ارسال نشد',
        status: 500
    },
    EMAIL_ERROR: {
        msgCode: 50006,
        mes: 'خطایی در ارسال ایمیل رخ داده است',
        status: 500
    },
    ERROR_MAKING_TRANSACTION: {
        msgCode: 50006,
        mes: 'تراکنش انجام نشد',
        status: 500
    },
    ZARIN_REQ_ERROR: {
        msgCode: 50007,
        mes: 'Zarinpal webservice is down',
        devMes: 'Zarinpal webservice is down',
        status: 500
    },
    ZARIN_REQ_INVALID: {
        msgCode: 50008,
        mes: 'Zarinpal error making payment request',
        devMes: 'Zarinpal error making payment request',
        status: 500
    },
    ZARINPAL_VERIFY_UNKOWN_ORDER: {
        msgCode: 50009,
        mes: 'verify unknown order',
        devMes: 'verify unknown order',
        status: 500
    },
    JSON_SYNTAX_ERROR: {
        msgCode: 50010,
        mes: 'JSON syntax error',
        devMes: 'JSON syntax error',
        status: 400
    },
    PAYLOAD_TOO_LARGE: {
        msgCode: 50011,
        mes: 'Request entity too large',
        devMes: 'Request entity too large',
        status: 413
    },
    SLUG_ALREADY_EXIST: {
        msgCode: 50012,
        mes: 'اسلاگ تکراری است',
        status: 406
    },
    CATEGORY_TYPE_NOT_EXIST: { msgCode: 36, mes: 'نوع دسته بندی وجود ندارد' },
    CATEGORY_ALREADY_EXIST: { msgCode: 37, mes: 'دسته بندی تکراری است' },
    CATEGORY_FOR_PRODUCT: { msgCode: 38, mes: 'این دسته بندی برای محصول است' },
    ERROR_UPLOAD_FILE: { msgCode: 45, mes: 'خطایی در آپلود فایل رخ داده است' },
    PASSWORD_ALREADY_USED: { msgCode: 46, mes: 'رمزعبور قبلا استفاده شده است' },
    PASSWORD_RESET_TOKEN_EXPIRED: { msgCode: 47, mes: 'توکن تغییر رمزعبور منقضی شده است' },
    TAG_ALREADY_EXIST: { msgCode: 48, mes: 'تگ تکراری است' },
    INGREDIENT_ALREADY_EXIST: { msgCode: 49, mes: 'ماده اولیه تکراری است' },
    CHEF_ALREADY_EXIST: { msgCode: 50, mes: 'سرآشپز تکراری است' },
    CATEGORY_NOT_FOUND: { msgCode: 51, mes: 'دسته بندی یافت نشد' },
    SUB_CATEGORY_NOT_FOUND: { msgCode: 52, mes: 'زیر دسته بندی یافت نشد' },
    TAG_NOT_FOUND: { msgCode: 53, mes: 'تگ یافت نشد' },
    RECIPE_NOT_FOUND: { msgCode: 54, mes: 'دستور پخت یافت نشد' },
    INVALID_ID: { msgCode: 55, mes: 'آیدی نامعتبر است' },
    TAG_TYPE_NOT_ALLOWED: { msgCode: 56, mes: 'نوع تگ مجاز نیست' },
    INGREDIENT_NOT_FOUND: { msgCode: 57, mes: 'ماده اولیه یافت نشد' },
    CHEF_NOT_FOUND: { msgCode: 58, mes: 'سرآشپز یافت نشد' },

}

export const UserType = Object.freeze({
    USER: 'USER',
    ADMIN: 'ADMIN',
    AUTHOR: 'AUTHOR',
    CHEF: 'CHEF',
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