import ValidationContext from '../ValidationContext'
import {TypeOptions, Type, INVALID} from '../typings'

export interface Options {
  minLength?: number
  maxLength?: number
  enum?:      string[]
  match?:     RegExp
}

function string(): Type<string> & {options: {required: true}}
function string(options?: TypeOptions<string> & Options & {required: false}): Type<string> & {options: {required: false}}
function string(options?: TypeOptions<string> & Options & {required?: true}): Type<string> & {options: {required: true}}
function string(options: TypeOptions<string> & Options = {}): Type<string> {
  return {
    options,

    cast(value: any, context: ValidationContext): string | INVALID {
      let string = value.toString()
      if (context.validator.options.trimStrings) {
        string = string.trim()
      }

      return string
    },

    serialize(value: string) {
      return value
    },

    validate(value: any, context: ValidationContext) {
      if (typeof value !== 'string') {
        context.addError('invalid_type', 'Expected a string')
        return
      }

      if (options.required !== false && value.length === 0) {
        context.addError('required', `This value is required`)
        return
      }

      if (options.minLength != null && value.length < options.minLength) {
        context.addError('string.too_short', `This value should be no shorter than ${options.minLength} character(s)`)
      }
      if (options.maxLength != null && string.length > options.maxLength) {
        context.addError('string.too_long', `This value should be no longer than ${options.maxLength} character(s)`)
      }
      if (options.enum != null && !options.enum.includes(value)) {
        context.addError('string.not_in_enum', 'Invalid value')
      }
      if (options.match != null && !options.match.test(value)) {
        context.addError('string.invalid', "This value is not correctly formatted")
      }
    }
  }
}

export default string