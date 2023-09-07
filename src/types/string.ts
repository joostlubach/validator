import { INVALID, Type, TypeOptions } from '../typings'
import ValidatorResult from '../ValidatorResult'

export interface StringOptions<T extends string> extends TypeOptions<T> {
  minLength?: number
  maxLength?: number
  enum?:      T[]
  match?:     RegExp
  transform?: (value: string) => T
}

function string<T extends string>(options: StringOptions<T> & {required: false}): Type<T[] | null>
function string<T extends string>(options: StringOptions<T>): Type<T[]>
function string<T extends string>(options: StringOptions<any>): Type<any> {
  return {
    name: 'string',
    options,

    coerce(value: any, result: ValidatorResult<any>): T | INVALID {
      let text = value == null ? '' : `${value}`
      if (result.validator.options.trimStrings) {
        text = text.trim()
      }
      if (options.transform != null) {
        return options.transform(text)
      } else {
        return text as T
      }
    },

    serialize(value: string) {
      return value
    },

    validate(value: T, result: ValidatorResult<any>) {
      if (typeof value !== 'string') {
        result.addError('invalid_type', 'Expected a string')
        return
      }

      const {
        minLength = options.required === false ? undefined : 1,
        maxLength,
        enum: enumValues,
        match,
      } = options

      if (minLength != null && value.length < minLength) {
        if (minLength === 1) {
          result.addError('required', "This value is required")
        } else {
          result.addError('string.too_short', `This value should be no shorter than ${minLength} character(s)`)
        }
      }
      if (maxLength != null && value.length > maxLength) {
        result.addError('string.too_long', `This value should be no longer than ${maxLength} character(s)`)
      }
      if (enumValues != null && !enumValues.includes(value)) {
        result.addError('string.not_in_enum', 'Invalid value')
      }
      if (match != null && !match.test(value)) {
        result.addError('string.invalid', "This value is not correctly formatted")
      }
    },
  }
}

export default string