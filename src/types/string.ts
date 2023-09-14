import { OptionalType, RequiredType, Type, TypeOptions } from '../typings'

export interface StringOptions<T extends string = string> extends TypeOptions<T> {
  minLength?: number
  maxLength?: number
  enum?:      T[]
  match?:     RegExp
  trim?:      'always' | 'never' | 'auto'
  transform?: (value: string) => T
}

function string(options: StringOptions & {required: false}): OptionalType<string, StringOptions>
function string(options?: StringOptions): RequiredType<string, StringOptions>

function string<T extends string>(options: StringOptions<T> & {required: false}): OptionalType<T, StringOptions<T>>
function string<T extends string>(options?: StringOptions<T>): RequiredType<T, StringOptions<T>>

function string(options: StringOptions<any> = {}): Type<any, any> {
  return {
    name: 'string',
    options,

    coerce: (value, result) => {
      let text = value == null ? '' : `${value}`

      const shouldTrim =
        options.trim === 'always' ? true :
        options.trim === 'never' ? false :
        result.validator.options.trimStrings
      if (shouldTrim) {
        text = text.trim()
      }

      if (options.transform != null) {
        return options.transform(text)
      } else {
        return text
      }
    },

    serialize: value => value,

    validate: (value, result) => {
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