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
export const addToAllSchemaProps = (schema, props) =>
    _.cloneDeepWith(_.cloneDeep(schema), (value) => {
        const objectType = value.type
        if (objectType === 'object') {
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
                value = _.merge(value, props)
                value.items.items = { ...value.items.items, ...props }
            }
        } else {
            if (allowedTypes.includes(value.type)) {
                value = _.merge(value, props)
            }
        }
    })

export const addLabelToSchemaType = (schema, label) => _.assign(schema, { label })
