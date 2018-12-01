import ValidationContext from '../ValidationContext'
import {TypeOptions, Type, INVALID} from '../typings'
import {isArray} from 'lodash'

export interface Options<T> {
  itemType:     Type<T>
  minElements?: number
  maxElements?: number
}

function array<T>(options: TypeOptions<T[]> & Options<T> & {required: false}): Type<T[]> & {options: {required: false}}
function array<T>(options: TypeOptions<T[]> & Options<T> & {required?: true}): Type<T[]> & {options: {required: true}}
function array<T>(options: TypeOptions<T[]> & Options<T>): Type<T[]> {
  return {
    options,

    cast(value: any, context: ValidationContext, partial: boolean): T[] | INVALID {
      if (!isArray(value)) { return INVALID }

      const result: T[] = []
      for (const element of value) {
        result.push(options.itemType.cast(element, context, partial) as T)
      }
      return result
    },

    serialize(value: T[]): any {
      return value.map(element => {
        if (element == null) {
          return null
        } else {
          return options.itemType.serialize(element)
        }
      })
    },

    async validate(value: any, context: ValidationContext): Promise<void> {
      if (!Array.isArray(value)) {
        context.addError('invalid_type', 'Expected an array')
        return
      }

      if (options.minElements != null && value.length < options.minElements) {
        context.addError('array.too_few_elements', `This value should have no less than ${options.minElements} item(s)`)
      }
      if (options.maxElements != null && value.length > options.maxElements) {
        context.addError('array.too_many_elements', `This value should have no more than ${options.maxElements} item(s)`)
      }

      if (options.itemType != null) {
        for (const [index, item] of value.entries()) {
          await context.validator.validateType(item, options.itemType, context.for(`${index}`))
        }
      }
    }
  }
}

export default array