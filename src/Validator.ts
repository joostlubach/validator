
import ValidatorResult from './ValidatorResult'
import {
  INVALID,
  Options,
  RequiredType,
  Type,
  TypeOptions,
  ValidateExtraFunction,
  ValidationError,
} from './typings'

export default class Validator {

  constructor(options: Options = {}) {
    this.options = {...Options.defaults, ...options}
  }

  protected errors: ValidationError[] = []
  public options:   Required<Options>

  public coerce<T>(raw: any, type: RequiredType<T, TypeOptions<T>>, partial: boolean): T | INVALID
  public coerce<T>(raw: any, type: Type<T, any>, partial: boolean): T | INVALID | null
  public coerce<T>(raw: any, type: Type<T, any>, partial: boolean): T | INVALID | null {
    const result = new ValidatorResult(this)

    if (type.options.coerce != null) {
      return type.options.coerce(raw)
    } else {
      return type.coerce(raw, result, partial)
    }
  }

  public async validate<T>(data: T, type: Type<T, any>, validateExtra?: ValidateExtraFunction<T>): Promise<ValidatorResult<T>> {
    const result = new ValidatorResult(this)
    if (type.validate) {
      type.validate(data, result)
    }
    if (validateExtra != null) {
      await validateExtra(result)
    }

    return result
  }

  public validateType<T>(value: T | null, type: Type<T, any>, result?: ValidatorResult<T>): ValidatorResult<T> {
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

    let validate = () => {
      if (value != null && type.validate != null) {
        type.validate(value, result)
      }
    }

    // Wrap in the custom callback if specified.

    const {callback} = this.options
    if (callback != null) {
      const upstream = validate
      validate = () => {
        callback(value, type, result, upstream)
      }
    }
    
    validate()
    return result
  }

}
