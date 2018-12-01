import ValidationContext from '../ValidationContext'
import {TypeOptions, Type, INVALID} from '../typings'

export interface Options {
  integer?: boolean
  min?:     number
  max?:     number
}

function number(): Type<number> & {options: {required: true}}
function number(options?: TypeOptions<number> & Options & {required: false}): Type<number> & {options: {required: false}}
function number(options?: TypeOptions<number> & Options & {required?: true}): Type<number> & {options: {required: true}}
function number(options: TypeOptions<number> & Options = {}): Type<number> {
  return {
    options,

    cast(value: any): number | INVALID {
      const num = options.integer ? parseInt(value, 10) : parseFloat(value)
      if (isNaN(num)) { return INVALID }
      return num
    },

    serialize(value: number) {
      return value
    },

    validate(value: any, context: ValidationContext) {
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        context.addError('invalid_type', 'Expected a number')
        return
      }

      if (options.integer && value % 1 !== 0) {
        context.addError('number.not_an_integer', `This value should be an integer`)
      }
      if (options.min != null && value < options.min) {
        context.addError('number.too_low', `This value should be at least ${options.min}`)
      }
      if (options.max != null && value > options.max) {
        context.addError('number.too_high', `This value should be at most ${options.max}`)
      }
    }
  }
}

export default number