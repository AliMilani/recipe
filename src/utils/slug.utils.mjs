import _ from 'lodash'

export const generateSlug = (text) => {
    let slug = text
        // select only persian, arabic, english letters and numbers
        .replace(
            /[^\w\s\-|\u0621-\u064A\u0660-\u0669\u06F0-\u06F9|\u06Af|\u067E|\u0698|\u0686|\u06CC|\u06A9|\u200C]/g,
            ''
        )
        // remove extra hyphens and spaces
        .replace(/^-+|-+$|^\s+|\s+$/g, '')
        // replace multiple spaces with single hyphen
        .replace(/\s+/g, '-')
        // replace zero-width non-joiner with a single hyphen
        .replace(/[\u200C]/g, '-')
        // replace multiple underscores with a single underscore for simplicity to read
        .replace(/_+/g, '_')
        // replace multiple hyphens with a single hyphen
        .replace(/-+/g, '-')
        .toLowerCase()

    return _convertNumbers(slug)
}

const _convertNumbers = (number) =>
    number
        .split('')
        .map((char) => _convertNumber(char))
        .join('')

const _convertNumber = (char) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

    if (arabicNumbers.includes(char)) {
        return englishNumbers[arabicNumbers.indexOf(char)]
    } else if (persianNumbers.includes(char)) {
        return englishNumbers[persianNumbers.indexOf(char)]
    } else {
        return char
    }
}


export const grantSlug = async (modelName, targetSlug, { excludeId } = {}) => {
    // console.log('slug: ' + slug);
    // const targetSlug = generateSlug(slug)
    // const targetSlug = slug
    const Model = (await import(`../models/${modelName}.model.mjs`)).default

    const results = await Model.find({
        $and: [
            { $or: [{ slug: new RegExp('^' + `${targetSlug}-[0-9]+$`, 'i') }, { slug: targetSlug }] },
            { _id: { $ne: excludeId } },
            // { slug: { $ne: excludeSlug } },
        ]

    }).select('slug')

    const slugs = _.map(results, 'slug')

    if (!_.includes(slugs, targetSlug)) return targetSlug
    if (slugs.length > 0)
        return `${targetSlug}-${_.find(
            _.range(1, slugs.length + 1),
            (i) => !_.includes(slugs, `${targetSlug}-${i}`)
        )}`
    throw new Error('Slug generation failed')
}

// grantSlug('recipe', 'ao').then((res) => console.log(res))
