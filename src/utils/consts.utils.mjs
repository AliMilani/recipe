export const Code = {
    OK: { num: 200, mes: 'عملیات موفقیت آمیز بود', status: 200 },
    AUTHENTICATION_FAILED: { num: 0, mes: 'عدم احراز هویت' },

    TOKEN_INVALID: { num: 1, mes: 'توکن نامعتبر است' },
    REFRESH_TOKEN_NOT_SET: {
        num: 1001,
        mes: 'توکن نامعتبر است',
        devMes: 'refresh token is not set'
    },
    REFRESH_TOKEN_EXPIRED: {
        num: 1002,
        mes: 'token is expired',
        devMes: 'refresh token is expired'
    },
    REFRESH_TOKEN_INVALID: {
        num: 1003,
        mes: 'توکن نامعتبر است',
        devMes: 'refresh token is invalid'
    },
    ACCESS_TOKEN_NOT_SET: { num: 1004, mes: 'توکن نامعتبر است', devMes: 'access token is not set' },
    ACCESS_TOKEN_EXPIRED: { num: 1005, mes: 'token is expired', devMes: 'access token is expired' },
    ACCESS_TOKEN_INVALID: { num: 1006, mes: 'توکن نامعتبر است', devMes: 'access token is invalid' },
    TOKEN_EXPIRED: { num: 1006, mes: 'token is expired', devMes: 'token is expired' },

    PASSWORD_PATTERN_INVALID: { num: 2, mes: 'الگوی رمزعبور نامعتبر است' },
    EMAIL_EXIST: { num: 3, mes: 'ایمیل تکراری است' },
    SIGN_UP_INVALID: { num: 4, mes: 'ثبتنام موفقیت آمیز نبود' },
    LOGIN_INVALID: { num: 5, mes: 'ورود موفقیت آمیز نبود' },
    NO_PRODUCT: { num: 6, mes: 'محصولی وجود ندارد' },
    TOKEN_DOES_NOT_EXIST: { num: 7, mes: 'توکن وجود ندارد' },
    NO_ORDER: { num: 8, mes: 'سفارش وجود ندارد' },
    EMAIL_DID_NOT_SENT: { num: 9, mes: 'ایمیل وجود ندارد' },
    PASSWORD_RESET_FAILED: { num: 10, mes: 'تغییر رمز عبور موفقیت آمیز نبود' },
    EDIT_PROFILE_FAILED: { num: 11, mes: 'ویرایش پروفایل موفقیت آمیز نبود' },
    PRODUCT_NOT_FOUND: { num: 12, mes: 'محصول یافت نشد' },
    ERROR_MAKING_TRANSACTION: { num: 13, mes: 'تراکنش انجام نشد' },
    INPUT_DATA_INVALID: { num: 14, mes: 'دیتای ورودی معتبر نیست' },
    TOO_MUCH_LOGIN: { num: 19, mes: 'تعداد درخواست ورود بیشتر از مقدار مجاز است' },
    PASSWORD_NEED_A_LETTER: { num: 20, mes: 'رمزعبور باید حداقل شامل یک حرف انگلیسی باشد' },
    PASSWORD_IS_SHORT: { num: 21, mes: 'رمزعبور باید ۸ کاراکتر یا بیشتر باشد' },
    PASSWORD_IS_TALL: { num: 22, mes: 'رمزعبور نباید بیشتر از ۶۰ کاراکتر باشد' },
    PASSWORD_NEED_A_DIGIT: { num: 23, mes: 'رمزعبور باید حداقل شامل یک عدد باشد' },
    EMAIL_PATTERN_INVALID: { num: 24, mes: 'یک ایمیل معتبر وارد کنید' },
    PASSWORD_HAS_SPACE: { num: 25, mes: 'رمزعبور نباید شامل کاراکتر space باشد' },
    DATABASE_ERROR: { num: 26, mes: 'خطایی در دیتابیس رخ داده است' },
    EMAIL_NOT_FOUND: { num: 27, mes: 'ایمیل یافت نشد' },
    EMAIL_SEND_FAILED: { num: 29, mes: 'ایمیل ارسال نشد' },
    PASSWORD_NOT_MATCH: { num: 30, mes: 'رمزعبور با تکرار آن مطابقت ندارد' },
    IS_LOGIN: { num: 31, mes: 'شما لاگین هستید' },
    SERVER_ERROR: { num: 32, mes: 'خطایی در سرور رخ داده است' },
    DATA_NOT_FOUND: { num: 33, mes: 'داده یافت نشد' },
    PRODUCT_EXIST: { num: 34, mes: 'محصول تکراری است' },
    PRODUCT_NOT_EXIST: { num: 35, mes: 'محصول وجود ندارد' },
    CATEGORY_TYPE_NOT_EXIST: { num: 36, mes: 'نوع دسته بندی وجود ندارد' },
    CATEGORY_ALREADY_EXIST: { num: 37, mes: 'دسته بندی تکراری است' },
    CATEGORY_FOR_PRODUCT: { num: 38, mes: 'این دسته بندی برای محصول است' },
    CATEGORY_FOR_BLOG: { num: 39, mes: 'این دسته بندی برای بلاگ است' },
    TYPE_NOT_EXIST: { num: 41, mes: 'نوع وجود ندارد' },
    AUTH_IS_NOT_SET: { num: 42, mes: 'پارامتر احراز هویت پیدا نشد' },
    TOO_MANY_REQUEST: {
        num: 43,
        mes: 'You sent too many requests. Please wait a while then try again'
    },
    USER_NOT_FOUND: { num: 44, mes: 'user not found', devMes: 'user not found' },
    ERROR_UPLOAD_FILE: { num: 45, mes: 'خطایی در آپلود فایل رخ داده است' },

    ACCESS_DENIED: {
        num: 46,
        mes: 'access denied for this user type',
        devMes: 'access denied for this user type'
    },
    USER_NOT_ADMIN: {
        num: 47,
        mes: 'access denied for this user type',
        devMes: 'user must have admin privilege'
    },

    ROUTE_NOT_FOUND: { num: 404, mes: 'route not found', devMes: 'route not found', status: 404 },

    UNKNOWN_ERROR: { num: 500, mes: 'unknown error', devMes: 'unknown error', status: 500 }
}

export const UserType = Object.freeze({
    USER: 1,
    ADMIN: 2
})