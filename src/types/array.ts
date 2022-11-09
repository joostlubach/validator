import ValidatorResult from '../ValidatorResult'
import { TypeOptions, Type, INVALID, COERCE, TraverseCallback, isSetResult } from '../typings'
import { isArray, isFunction } from 'lodash'

export interface Options<T> extends TypeOptions<T[]> {
  itemType:     Type<T>
  minElements?: number
  maxElements?: number
}

function array<T>(options: Options<T>): Type<T[]> {
  return {
    name: 'array',
    options,

    coerce(value: any, result: ValidatorResult<any>, partial: boolean): T[] | INVALID {
      if (value != null && !isArray(value) && isFunction(value[COERCE])) {
        value = value[COERCE](this)
      }
      if (options.coerce != null) {
        value = options.coerce(value)
      }

      if (!isArray(value)) { return INVALID }

      const coerced: T[] = []
      for (const element of value) {
        coerced.push(options.itemType.coerce(element, result, partial) as T)
      }
      return coerced
    },

    serialize(value: T[]): any {
      if (!isArray(value)) { return INVALID }

      return value.map(element => {
        if (element == null) {
          return null
        } else {
          return options.itemType.serialize(element, value)
        }
      })
    },

    traverse(value: T[], path: string[], callback: TraverseCallback) {
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

    async validate(value: any, result: ValidatorResult<any>): Promise<void> {
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
          await result.validator.validateType(item, options.itemType, result.for(`${index}`))
        }
      }
    },
  }
}

export default array