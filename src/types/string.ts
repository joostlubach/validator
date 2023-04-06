import { INVALID, Type, TypeOptions } from '../typings'
import ValidatorResult from '../ValidatorResult'

export interface Options extends TypeOptions<string> {
  minLength?: number
  maxLength?: number
  enum?:      string[]
  match?:     RegExp
  transform?: (value: string) => string
}

function string(options: Options = {}): Type<string> {
  return {
    name: 'string',
    options,

    coerce(value: any, result: ValidatorResult<any>): string | INVALID {
      let text = value == null ? '' : `${value}`
      if (result.validator.options.trimStrings) {
        text = text.trim()
      }
      if (options.transform != null) {
        return options.transform(text)
      }

      return text
    },

    serialize(value: string) {
      return value
    },

    validate(value: any, result: ValidatorResult<any>) {
      if (typeof value !== 'string') {
        result.addError('invalid_type', 'Expected a string')
        return
      }

      if (options.minLength != null && value.length < options.minLength) {
        result.addError('string.too_short', `This value should be no shorter than ${options.minLength} character(s)`)
      }
      if (options.maxLength != null && value.length > options.maxLength) {
        result.addError('string.too_long', `This value should be no longer than ${options.maxLength} character(s)`)
      }
      if (options.enum != null && !options.enum.includes(value)) {
        result.addError('string.not_in_enum', 'Invalid value')
      }
      if (options.match != null && !options.match.test(value)) {
        result.addError('string.invalid', "This value is not correctly formatted")
      }
    },
  }
}

export default string