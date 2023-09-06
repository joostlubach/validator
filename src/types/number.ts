import { INVALID, Type, TypeOptions } from '../typings'
import ValidatorResult from '../ValidatorResult'

export interface NumberOptions extends TypeOptions<number> {
  integer?: boolean
  min?:     number
  max?:     number
}

export default function number(options: NumberOptions = {}): Type<number> {
  return {
    name: 'number',
    options,

    coerce(value: any): number | INVALID {
      if (value === INVALID) { return INVALID }

      const num = options.integer ? parseInt(value, 10) : parseFloat(value)
      if (isNaN(num)) { return INVALID }
      return num
    },

    serialize(value: number) {
      return value
    },

    validate(value: any, result: ValidatorResult<any>) {
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        result.addError('invalid_type', 'Expected a number')
        return
      }

      if (options.integer && value % 1 !== 0) {
        result.addError('number.not_an_integer', `This value should be an integer`)
      }
      if (options.min != null && value < options.min) {
        result.addError('number.too_low', `This value should be at least ${options.min}`)
      }
      if (options.max != null && value > options.max) {
        result.addError('number.too_high', `This value should be at most ${options.max}`)
      }
    },
  }
}