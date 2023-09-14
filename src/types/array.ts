import { isArray } from 'lodash'
import { INVALID, isSetResult, OptionalType, RequiredType, Type, TypeOptions } from '../typings'

export interface ArrayOptions<T> extends TypeOptions<T[]> {
  itemType:     Type<T, any>
  minElements?: number
  maxElements?: number
}

function array<T>(options: ArrayOptions<T> & {required: false}): OptionalType<T[], ArrayOptions<T>>
function array<T>(options: ArrayOptions<T>): RequiredType<T[], ArrayOptions<T>>
function array(options: ArrayOptions<any>): Type<any, any> {
  return {
    name: 'array',
    options,

    coerce: (value, result, partial) => {
      if (!isArray(value)) { return INVALID }

      const coerced: any[] = []
      for (const element of value) {
        coerced.push(options.itemType.coerce(element, result, partial))
      }
      return coerced
    },

    serialize: value => {
      if (!isArray(value)) { return INVALID }

      return value.map(element => {
        if (element == null) {
          return null
        } else {
          return options.itemType.serialize(element, value)
        }
      })
    },

    traverse: (value, path, callback) => {
      if (!isArray(value)) { return }

      for (const [index, propValue] of value.entries()) {
        const propPath = [...path, index.toString()]

        const retval = callback(propValue, propPath.join('.'), options.itemType)
        if (retval === false) { return }

        if (isSetResult(retval)) {
          value[index] = retval.set
        }

        options.itemType?.traverse?.(propValue, propPath, callback)
      }
    },

    validate: (value, result) => {
      if (!Array.isArray(value)) {
        result.addError('invalid_type', 'Expected an array')
        return
      }

      if (options.minElements != null && value.length < options.minElements) {
        result.addError('array.too_few_elements', `This value should have no less than ${options.minElements} item(s)`)
      }
      if (options.maxElements != null && value.length > options.maxElements) {
        result.addError('array.too_many_elements', `This value should have no more than ${options.maxElements} item(s)`)
      }

      if (options.itemType != null) {
        for (const [index, item] of value.entries()) {
          result.validator.validateType(item, options.itemType, result.for(`${index}`))
        }
      }
    },
  }
}

export default array