import { INVALID, TypeOptions } from '../typings'
import { defineType } from '../util'
import ValidatorResult from '../ValidatorResult'

export interface NumberOptions extends TypeOptions<number> {
  integer?: boolean
  min?:     number
  max?:     number
}

const number = defineType<number, NumberOptions>('number', options => ({
  coerce: value => {
    if (value === INVALID) { return INVALID }

    const num = options.integer ? parseInt(value, 10) : parseFloat(value)
    if (isNaN(num)) { return INVALID }
    return num
  },

  serialize: value => value,

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
}))

export default number