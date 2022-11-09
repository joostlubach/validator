import ValidatorResult from './ValidatorResult'
import { Type, ValidationError, ValidateExtraFunction, Options, INVALID } from './typings'
import { isFunction } from 'lodash'

export default class Validator<T = never> {

  private constructor(
    public readonly instance: T,
    options: Options
  ) {
    this.errors = []
    this.options = {...Options.defaults, ...options}
  }

  public static create(options?: Options): Validator<never>
  public static create<T>(instance: T, options?: Options): Validator<T>
  public static create(...args: any[]): any {
    const options: Options = Options.isOptions(args[args.length - 1]) ? args.pop() : {}
    const instance = args.pop()

    return new Validator(instance, options)
  }

  public options: Required<Options>
  private errors:  ValidationError[] = []

  public coerce<T>(raw: any, type: Type<T>, partial: boolean): T | INVALID {
    const result = new ValidatorResult(this)
    return type.coerce(raw, result, partial)
  }

  public async validate<U>(data: U, type: Type<U>, validateExtra?: ValidateExtraFunction<T>): Promise<ValidatorResult<T>> {
    const result = new ValidatorResult(this)
    if (type.validate) {
      await type.validate(data, result)
    }
    if (validateExtra != null) {
      await validateExtra(result)
    }

    return result
  }

  public async validateType<U>(value: U | null, type: Type<U>): Promise<ValidatorResult<T>>
  public async validateType<U, V>(value: U | null, type: Type<U>, result: ValidatorResult<V>): Promise<ValidatorResult<V>>
  public async validateType<U>(value: U | null, type: Type<U>, result?: ValidatorResult<any>): Promise<ValidatorResult<any>> {
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
      await type.validate(value, result)
    }

    // Run any custom validator.
    if (type.options != null && value != null && isFunction(type.options.validate)) {
      await type.options.validate(value, result)
    }

    return result
  }

}