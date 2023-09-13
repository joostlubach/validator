import { isFunction } from 'lodash'
import {
  INVALID,
  Options,
  RequiredType,
  Type,
  TypeOptions,
  ValidateExtraFunction,
  ValidationError,
} from './typings'
import ValidatorResult from './ValidatorResult'

export default class Validator {

  constructor(options: Options = {}) {
    this.options = {...Options.defaults, ...options}
  }

  protected errors: ValidationError[] = []
  public options: Required<Options>

  public coerce<T>(raw: any, type: RequiredType<T, TypeOptions<T>>, partial: boolean): T | INVALID
  public coerce<T>(raw: any, type: Type<T>, partial: boolean): T | INVALID | null
  public coerce<T>(raw: any, type: Type<T>, partial: boolean): T | INVALID | null {
    const result = new ValidatorResult(this)

    if (type.options.coerce != null) {
      return type.options.coerce(raw)
    } else {
      return type.coerce(raw, result, partial)
    }
  }

  public async validate<T>(data: T, type: Type<T>, validateExtra?: ValidateExtraFunction<T>): Promise<ValidatorResult<T>> {
    const result = new ValidatorResult(this)
    if (type.validate) {
      type.validate(data, result)
    }
    if (validateExtra != null) {
      await validateExtra(result)
    }

    return result
  }

  public validateType<T>(value: T | null, type: Type<T>, result?: ValidatorResult<T>): ValidatorResult<T> {
    result ??= new ValidatorResult(this)

    if (type == null) {
      if (!this.options.ignoreUnknown) {
        result.addError('unknown', `Unknown attribute: ${result.attribute}`)
      }
      return result
    }

    if (value == null && type.options.required !== false && type.options.default == null) {
      result.addError('required', `This value is required`)
    }

    if (value != null && type.validate != null) {
      type.validate(value, result)
    }

    // Run any custom validator.
    if (type.options != null && value != null && isFunction(type.options.validate)) {
      type.options.validate(value, result)
    }

    return result
  }

}