/**
 * @example calculateCustomDate('30d') // 2022-08-22T16:41:52.345Z
 * @param {customDate} customDate
 * @returns {Date} Date
 */
export const calculateCustomDate = (customDate) => {
    const INVALID_DATE_ERROR = 'Invalid date format. (e.g. 1d, 1h, 1m, 1s)'
    if (customDate === undefined) throw new Error('customDate is required')
    let date = new Date()
    const extractedDate = customDate.match(/^(\d+)([dhms]+)$/)
    if (extractedDate === null) throw new Error(INVALID_DATE_ERROR)
    let [, amount, unit] = extractedDate
    if (!amount || !unit) throw new Error(INVALID_DATE_ERROR)

    switch (unit) {
        case 'd':
            date.setDate(date.getDate() + parseInt(amount))
            break
        case 'h':
            date.setHours(date.getHours() + parseInt(amount))
            break
        case 'm':
            date.setMinutes(date.getMinutes() + parseInt(amount))
            break
        case 's':
            date.setSeconds(date.getSeconds() + parseInt(amount))
            break
        default:
            throw new Error(INVALID_DATE_ERROR)
    }

    return date
}
