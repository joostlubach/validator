import Validator from './Validator'
import { ValidationError, ValidatorResultSerialized } from './typings'

export default class ValidatorResult<T> {

  constructor(
    public readonly validator: Validator,
    public readonly parts: string[] = [],
  ) {}

  // #region Attributes & paths

  public get attribute(): string {
    if (this.parts.length === 0) { return '<root>' }
    return this.parts[this.parts.length - 1]
  }

  public get path(): string | null {
    if (this.parts.length === 0) { return null }
    return this.parts.join('.')
  }

  public for(attribute: string): ValidatorResult<T> {
    return new ValidatorResult<T>(this.validator, this.parts.concat([attribute]))
  }

  // #endregion

  // #region Errors & valid

  public get isValid() {
    return this.getErrors().length === 0
  }

  private get errors() {
    // Note: errors is protected, but should be like library-protected.
    return (this.validator as any).errors
  }

  private set errors(value: ValidationError[]) {
    // Note: errors is protected, but should be like library-protected.
    (this.validator as any).errors = value
  }

  public getErrors() {
    return this.errors.filter(error => {
      if (this.path == null) { return true }
      if (error.path === this.path) { return true }
      return error.path?.startsWith(this.path + '.')
    })
  }

  public addError(code?: string, message?: string) {
    this.errors.push({
      path: this.path ?? null,
      code,
      message,
    })
  }

  public addErrors(errors: Omit<ValidationError, 'path'>[]) {
    this.errors.push(
      ...errors.map(err => ({path: this.path ?? null, ...err})),
    )
  }

  public clearErrors() {
    this.errors = this.errors.filter(
      error => error.path !== this.path,
    )
  }

  public prefix(prefix: string) {
    // Prefixes all errors with the given prefix, and updates the prefix for this result.
    for (const error of this.getErrors()) {
      error.path = `${prefix}.${error.path}`
    }

    this.parts.unshift(prefix)
    return this    
  }

  // #endregion

  // #region Merging

  public static merge(results: ValidatorResult<any>[]) {
    if (results.length === 0) {
      return new ValidatorResult<any>(new Validator())
    }

    const merged = new ValidatorResult<any>(results[0].validator)
    for (const result of results) {
      merged.mergeResult(result)
    }

    return merged
  }

  public mergeResult(other: ValidatorResult<any>) {
    const result = other.parts.reduce<ValidatorResult<any>>(
      (curr, part) => curr.for(part),
      this,
    )

    result.addErrors(other.getErrors())
  }

  // #endregion

  // #region Serialization

  public serialize(): ValidatorResultSerialized {
    const errors = this.getErrors()

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  // #endregion

}
