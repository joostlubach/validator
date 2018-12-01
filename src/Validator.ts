import ValidationContext from './ValidationContext'
import {Type, ValidationResult, ValidationError, Options, INVALID} from './typings'
import {isFunction} from 'lodash'

export type ExtraValidator = (context: ValidationContext) => void | Promise<void>

const defaultOptions = {
  ignoreUnknown: true,
  trimStrings:   true
}

export default class Validator<T> {

  constructor(options: Options = {}) {
    this.errors = []
    this.options = {...defaultOptions, ...options}
  }

  options:  Options
  errors:   ValidationError[]

  cast(raw: any, type: Type<T>, insertNulls: boolean): T | INVALID {
    const context = new ValidationContext(this)
    return type.cast(raw, context, insertNulls)
  }

  async validate(instance: T, type: Type<T>, validateExtra?: ExtraValidator): Promise<ValidationResult> {
    const context = new ValidationContext(this)
    if (type.validate) {
      await type.validate(instance, context)
    }

    if (validateExtra != null) {
      await validateExtra(context)
    }

    return {
      valid:  this.errors.length === 0,
      errors: this.errors
    }
  }

  async validateType<T>(value: T | null, type: Type<T>, context: ValidationContext): Promise<any> {
    if (type == null) {
      if (!this.options.ignoreUnknown) {
        context.addError('unknown', `Unknown attribute: ${context.attribute}`)
      }
      return value
    }

    if (value == null && type.options.required !== false && type.options.default == null) {
      context.addError('required', `This value is required`)
    }

    if (value != null && type.validate != null) {
      await type.validate(value, context)
    }

    // Run any custom validator.
    if (type.options != null && isFunction(type.options.validate)) {
      await type.options.validate(value, context)
    }

    return value
  }

}