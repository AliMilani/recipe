export const schemaTypes = {
    entityName: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 150
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minlength: 1,
        maxlength: 255
    },
    description: {
        type: String,
        trim: true,
        maxlength: 3000
    },
    image: {
        type: String,
        maxlength: 2048,
        minlength: 6,
        validate: {
            validator: (v) => /\.(jpe?g|png|gif|bmp|webp)$/i.test(v)
        }
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 70
    }
}
