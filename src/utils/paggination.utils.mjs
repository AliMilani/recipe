const pagination = async (model, query, { page = 1, limit = 10, populate, select, sort } = {}) => {
    let totalPages
    let totalDocs
    let hasPrevPage
    let hasNextPage
    let prevPage
    let nextPage

    let module = await import(`../models/${model}.model.mjs`)
    let Model = module.default

    const items = await Model.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate(populate)
        .sort(sort)
        .select(select)


    totalDocs = await Model.countDocuments()
    totalPages = Math.ceil(totalDocs / limit)
    if (page + 1 > totalPages) {
        nextPage = null
        hasNextPage = false
    } else {
        nextPage = page + 1
        hasNextPage = true
    }

    if (page === 1) {
        prevPage = null
        hasPrevPage = false
    } else {
        prevPage = page - 1
        hasPrevPage = true
    }

    return {
        items,
        page,
        limit,
        totalPages,
        totalDocs,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage
    }
}

export default pagination
