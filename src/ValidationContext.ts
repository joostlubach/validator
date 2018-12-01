import Validator from './Validator'

export default class ValidationContext {

  constructor(validator: Validator<any>, parts: string[] = []) {
    this.validator = validator
    this.parts = parts
  }

  validator: Validator<any>
  parts: string[]

  get attribute(): string {
    if (this.parts.length === 0) { return '<root>' }
    return this.parts[this.parts.length - 1]
  }

  get path(): string | null {
    if (this.parts.length === 0) { return null }
    return this.parts.join('.')
  }

  for(attribute: string): ValidationContext {
    return new ValidationContext(this.validator, this.parts.concat([attribute]))
  }

  getErrors() {
    return this.validator.errors.filter(error => error.path === this.path)
  }

  addError(message: string): void
  addError(code: string, message: string): void
  addError(...args: string[]) {
    const message = args.pop()!
    const code = args.length > 0 ? args.pop()! : null

    // flow:ignore - dynamic arguments
    this.validator.errors.push({
      path: this.path || null,
      code,
      message
    })
  }

}