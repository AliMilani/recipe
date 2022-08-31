import _ from 'lodash'

const allowedTypes = [
    'any',
    'array',
    'boolean',
    'custom',
    'date',
    'email',
    'enum',
    'equal',
    'forbidden',
    'function',
    'luhn',
    'mac',
    'multi',
    'number',
    'object',
    'string',
    'tuple',
    'url',
    'uuid',
    'objectID'
]
export const addToAllSchemaProps = (
    schema,
    props,
    // {
    //     schemaAllowedTypes = allowedTypes
    //     // ,includesArray = true,
    //     // includesObject = true,
    // } = {}
) =>
    _.cloneDeepWith(schema, (value) => {
        const objectType = value.type
        if (objectType === 'object') {
            // if (includesObject)
            value = _.merge(value, props)
            value.props = _.mapValues(value.props, (val) => {
                if (val.type === 'object') {
                    val.props = _.mapValues(val.props, (v) => ({ ...v, ...props }))
                } else if (val.type === 'array') {
                    val.items = { ...val.items, ...props }
                }
                return val
            })
        } else if (objectType === 'array') {
            value = _.merge(value, props)
            if (value.items.type === 'object') {
                value.items.props = _.mapValues(value.items.props, (val) => ({
                    ...val,
                    ...props
                }))
            }
            if (value.items.type === 'array') {
                // if (includesArray)
                value = _.merge(value, props)
                value.items.items = { ...value.items.items, ...props }
            }
        } else {
            // if (schemaAllowedTypes.includes(value.type)) {
            if (allowedTypes.includes(value.type)) {
                value = _.merge(value, props)
            }
        }
    })

// export const makeAllOptional = (schema) =>
//     _.cloneDeepWith(schema, (value) => {
//         const objectType = value.type
//         if (objectType === 'object') {
//             value.optional = true
//             value.props = _.mapValues(value.props, (val) => {
//                 if (val.type === 'object') {
//                     val.props = _.mapValues(val.props, (v) => ({ ...v, optional: true }))
//                 } else if (val.type === 'array') {
//                     val.items = { ...val.items, optional: true }
//                 }
//                 return val
//             })
//         } else if (objectType === 'array') {
//             if (value.items.type === 'object') {
//                 value.items.props = _.mapValues(value.items.props, (val) => ({
//                     ...val,
//                     optional: true
//                 }))
//             }
//             if (value.items.type === 'array') {
//                 value.optional = true
//                 value.items.items = { ...value.items.items, optional: true }
//             }
//         } else {
//             // if (!['array', 'object'].includes(value.type) && value.type && value) {
//             //     console.log(value);
//             // }
//             // if (!['array', 'object'].includes(value.type) && value.type) {
//             //     value.optional = true
//             // }
//             if (allowedTypes.includes(value.type)) {
//                 value.optional = true
//             }
//         }
//     })
